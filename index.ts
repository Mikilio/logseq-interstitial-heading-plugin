import '@logseq/libs';
import { BlockEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user"
import dayjs from 'dayjs';

interface PluginSettings {
  timestampTopLevel: boolean;
  timestampFormat: string;
  timestampSeparator: string;
  timestampShortcut: string;
}

type LogseqAppWithUnregister = typeof logseq.App & {
  unregister_plugin_simple_command?: (key: string) => void;
};

const pluginName = ["logseq-interstitial", "Logseq Interstitial"]
const timestampShortcutCommandKey = "insert-interstitial-timestamp"
const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "timestampTopLevel",
    type: "boolean",
    default: true,
    title: "Timestamp Top-Level Block",
    description: "Whether the plugin should automatically timestamp the top-level blocks of a journal page",
  },
  {
    key: "timestampFormat",
    type: "string",
    default: "HH:mm",
    title: "Timestamp Format",
    description: "Accepts any valid Day.js format string (e.g., 'HH:mm', 'YYYY-MM-DD HH:mm', or 'dddd h:mm A'). To append a '+' or '-' suffix directly to the formatted timestamp, simply include it at the end of your format string.",
  },
  {
    key: "timestampSeparator",
    type: "string",
    default: "",
    title: "Timestamp Header Styling",
    description: "When in use, the timestamp gets its own line (like a header for the node) and your entry starts below it, which can be prefixed by any separator of your choosing (e.g. '+', '-', '*') which will be followed by a space before the entry. Leave this field empty to use the default plain timestamp format.",
  },
  {
    key: "timestampShortcut",
    type: "string",
    title: "Keyboard Shortcut",
    description: "Enter the shortcut key (e.g., mod+t)",
    default: "mod+t",
  }
]
logseq.useSettingsSchema(settingsTemplate)

function getTimestampShortcut(settings: PluginSettings): string {
  const shortcut = typeof settings.timestampShortcut === "string"
    ? settings.timestampShortcut.trim().toLowerCase()
    : "";

  return shortcut !== "" ? shortcut : "mod+t";
}

function registerTimestampShortcut(settings: PluginSettings) {
  logseq.App.registerCommandPalette(
    {
      key: timestampShortcutCommandKey,
      label: "Insert interstitial timestamp",
      keybinding: {
        mode: "global",
        binding: getTimestampShortcut(settings),
      },
    },
    async () => {
      await insertInterstitional();
    }
  );
}

function unregisterTimestampShortcut() {
  // The shortcut is keyed under the plugin id; remove the old binding before re-registering.
  (logseq.App as LogseqAppWithUnregister).unregister_plugin_simple_command?.(
    `${logseq.baseInfo.id}/${timestampShortcutCommandKey}`
  );
}

function buildRegexFromFormat(format: string): RegExp {
  const tokenMap: Record<string, string> = {
    "YYYY": "\\d{4}",
    "MM": "\\d{2}",
    "DD": "\\d{2}",
    "HH": "\\d{2}",
    "mm": "\\d{2}",
    "A": "(AM|PM)",
    "a": "(am|pm)",
    "ddd": "[A-Za-z]{3}",
    "dddd": "[A-Za-z]+",
    "H": "\\d{1,2}",
    "m": "\\d{1,2}",
    "h": "\\d{1,2}",
    "hh": "\\d{2}",
  };

  const escaped = format.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape literal symbols
  const regexStr = Object.keys(tokenMap).reduce((str, token) => {
    return str.replace(new RegExp(token, "g"), tokenMap[token]);
  }, escaped);

  return new RegExp(`^\\s*${regexStr}\\s*`);
}

async function updateBlock(block: BlockEntity, update: boolean = false) {
  if (!logseq?.settings) {
    throw new Error("logseq.settings is not defined!");
  }

  const settings = logseq.settings as unknown as PluginSettings;

  const formatStr = typeof settings.timestampFormat === "string" && settings.timestampFormat.trim() !== ""
    ? settings.timestampFormat.trim()
    : "HH:mm";

  const separator = typeof settings.timestampSeparator === "string"
    ? settings.timestampSeparator.trim()
    : "";

  const now = dayjs();
  const timeMarkup = now.format(formatStr);
  // With a separator set, the timestamp gets its own line and the entry starts on
  // the next line prefixed by the separator, e.g. "09:22\n+".
  const stampPrefix = separator ? `${timeMarkup}\n${separator}` : timeMarkup;

  const timeRegex = buildRegexFromFormat(formatStr);

  let contentWithoutTimestamp = block.content;
  if (timeRegex.test(block.content)) {
    contentWithoutTimestamp = block.content.replace(timeRegex, "").trim();
    console.log(contentWithoutTimestamp + "time:" + timeRegex);
  }

  // Drop a previously inserted separator so re-stamping doesn't stack them.
  if (separator && contentWithoutTimestamp.startsWith(separator)) {
    contentWithoutTimestamp = contentWithoutTimestamp.slice(separator.length).trimStart();
  }

  const cleanedContent = contentWithoutTimestamp.replace(/\{\{[^}]*\}\}/g, '').trim();

  const hasRealContent = cleanedContent.length > 0;
  const isAlreadyStamped = timeRegex.test(block.content);
  const isEmptyBlock = contentWithoutTimestamp.trim() === "";

  if (update && isEmptyBlock && !isAlreadyStamped) {
    // Pre-fill a trailing space after the separator so typing continues after "+ ".
    await logseq.Editor.updateBlock(block.uuid, separator ? `${stampPrefix} ` : stampPrefix);
    return;
  }

  if ((update && hasRealContent) || (!isAlreadyStamped && hasRealContent)) {
    await logseq.Editor.updateBlock(
      block.uuid,
      `${stampPrefix} ${contentWithoutTimestamp}`.trim()
    );
  }
}

async function insertInterstitional() {
  const selected = await logseq.Editor.getSelectedBlocks();
  if (selected && selected.length > 1) {
    for (const block of selected) {
      await updateBlock(block, true);
    }
  } else {
    const block = await logseq.Editor.getCurrentBlock();
    if (block?.uuid) {
      await updateBlock(block, true);
    }
  }
}


async function maybeTimestampBlock(block: BlockEntity) {
  const settings = logseq.settings as unknown as PluginSettings;
  const parent = await logseq.Editor.getBlock(block.parent.id, { includeChildren: false });
  const page = await logseq.Editor.getPage(block.page.id);
  console.log(`Parent: ${parent?.id}, Page: ${page?.id}, Journal: ${page?.['journal?']}`);

  let shouldUpdate = false;

  if (parent?.properties?.interstitialTemplate) {
    shouldUpdate = true;
  } 

  if (settings.timestampTopLevel && page?.['journal?'] && !parent) {
    shouldUpdate = true;
  }

  if (shouldUpdate) {
    await updateBlock(block);
  }
}


const main = async () => {
  console.log(`Plugin: ${pluginName[1]} loaded`)

  if (!logseq?.settings) {
    throw new Error("logseq.settings is not defined!");
  }

  const settings = logseq.settings as unknown as PluginSettings;
  let registeredTimestampShortcut = getTimestampShortcut(settings);

  logseq.Editor.registerSlashCommand('Mark as Interstitial Template', async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (block?.uuid) {
      await logseq.Editor.upsertBlockProperty(block.uuid, "interstitial-template", true);
    }
  });

  registerTimestampShortcut(settings);

  logseq.onSettingsChanged((updatedSettings) => {
    const nextShortcut = getTimestampShortcut(updatedSettings as unknown as PluginSettings);
    if (nextShortcut === registeredTimestampShortcut) {
      return;
    }

    unregisterTimestampShortcut();
    registerTimestampShortcut(updatedSettings as unknown as PluginSettings);
    registeredTimestampShortcut = nextShortcut;
  });

  logseq.DB.onChanged((e) => {
    if (e.txMeta?.outlinerOp == "save-block" || e.txMeta?.outlinerOp == "saveBlock") {
      const block = e.blocks[0];
      maybeTimestampBlock(block)
      // if (logseq.settings?.enableAutoParse ) {
    }
  });
}

logseq.ready(main).catch(console.error);
