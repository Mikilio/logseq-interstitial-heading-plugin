import '@logseq/libs';
import { BlockEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user"
import dayjs from 'dayjs';

interface PluginSettings {
  timestampFormat: string;
  timestampShortcut: string;
}


const pluginName = ["logseq-interstitial", "Logseq Interstitial"]
const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "timestampFormat",
    type: "string",
    default: "HH:mm",
    title: "Timestamp Format",
    description: "Use any format supported by dayjs. Example: 'HH:mm', 'YYYY-MM-DD HH:mm', 'dddd h:mm A'",
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

  const now = dayjs();
  const timeMarkup = now.format(formatStr);

  const timeRegex = buildRegexFromFormat(formatStr);

  let contentWithoutTimestamp = block.content;
  if (timeRegex.test(block.content)) {
    contentWithoutTimestamp = block.content.replace(timeRegex, "").trim();
    console.log(contentWithoutTimestamp + "time:" + timeRegex);
  }

  const cleanedContent = contentWithoutTimestamp.replace(/\{\{[^}]*\}\}/g, '').trim();

  const hasRealContent = cleanedContent.length > 0;
  const isAlreadyStamped = timeRegex.test(block.content);

  if ((update && hasRealContent) || (!isAlreadyStamped && hasRealContent)) {
    await logseq.Editor.updateBlock(
      block.uuid,
      `${timeMarkup} ${contentWithoutTimestamp}`.trim()
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
  if (!block.parent?.id) return;

  const parent = await logseq.Editor.getBlock(block.parent.id, { includeChildren: false });
  if (parent?.properties?.interstitialTemplate) {
    await updateBlock(block);
  }
}

const main = async () => {
  console.log(`Plugin: ${pluginName[1]} loaded`)

  if (!logseq?.settings) {
    throw new Error("logseq.settings is not defined!");
  }

  logseq.Editor.registerSlashCommand('Mark as Interstitial Template', async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (block?.uuid) {
      await logseq.Editor.upsertBlockProperty(block.uuid, "interstitial-template", true);
    }
  });

  logseq.App.registerCommandShortcut(
    { binding: logseq.settings?.timestampShortcut as string },
    () => {
      insertInterstitional()
    }
  );

  logseq.DB.onChanged((e) => {
    if (e.txMeta?.outlinerOp == "save-block" || e.txMeta?.outlinerOp == "saveBlock") {
      const block = e.blocks[0];
      maybeTimestampBlock(block)
      // if (logseq.settings?.enableAutoParse ) {
    }
  });
}

logseq.ready(main).catch(console.error);
