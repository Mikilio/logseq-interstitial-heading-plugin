# Logseq Interstitial journaling
<div id="top"></div>
<!--
*** Thanks for checking out Unfinished business. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![latest release version][release-shield]][release-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

> Interstitial journaling is a productivity technique created by Tony Stubblebine. To my knowledge, it’s the simplest way to combine note-taking, tasks, and time tracking in one unique workflow. -- [Interstitial journaling: combining notes, to-do & time tracking - Ness Labs](https://nesslabs.com/interstitial-journaling)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Mikilio/logseq-interstitial-heading-plugin">
    <img src="./img/background.png" alt="Logo" width="420" height="240">
  </a>

<h3 align="center">Logseq Interstitial journaling</h3>

  <p align="center">
    Because your journal is neither foreboding nor an afterthought
    <br />
    <a href="https://github.com/qWxleA/logseq-interstitial-heading-plugin">View Demo</a>
    ·
    <a href="https://github.com/qWxleA/logseq-interstitial-heading-plugin/issues">Report Bug</a>
    ·
    <a href="https://github.com/qWxleA/logseq-interstitial-heading-plugin/issues">Request Feature</a>
  </p>
</div>

This plugin helps you quickly create time-stamps, without interupting your thought.

The features included are:
- Automatic time-stamps on top-level blocks of your journal.
- Automatic time-stamps on marked blocks. (Useful for templates)
- Update or add timestamps with a configurable shortcut.


> It is true. I am 217% happier now. 
>
>— <cite>Excited customer</cite>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#Using the plugin">Using the plugin</a></li>
    <li><a href="#Configuration">Configuration</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## Installation

### Preparation

- Click the 3 dots in the righthand corner and go to **Settings**.
- Go to **Advanced** and enable **Plug-in system**.
- Restart the application.
- Click 3 dots and go to Plugins (or `Esc t p`).

### Install plugin from the Marketplace (recommended) 

- Click the `Marketplace` button and then click `Plugins`.
- Find the plugin and click `Install`.

### Install plugin manually

- Download a released version assets from Github.
- Unzip it.
- Click `Load unpacked plugin`, and select destination directory to the unzipped folder.

## Using the plugin

This plugin makes it *just* a tiny bit easier to use Logseq as an interstitial journal.

By default, it will add time stamps to top-level blocks of your journals, however, this can be turned off in the settings.

### Automatic timestamps on templates

![interstial journal example](./img/template.png)

You can mark block by adding the property `interstitial-template:: true` to blocks.
The behavior will be the same as for the Journal page: Only top-level child blocks of that block get timestamped.

### Adding timestamps to your journal

![interstial journal example](./img/journal.png)

- By default, you can use `Ctrl-t` to insert a timestamp in the current block/line.

### Configuration

![settings](./img/settings.png)

The recommended usage is to do pure interstitial journaling on your journal pages and link them to your actual "knowledge nodes" this plays nicely with the graph view as journal pages are automaticallly exluded. If you prefer another workflow however you can turn off the automatic timestamps.

Under settings, you can change the default timestamp (e.g. \*\*HH:MM\*\* if you want to use **bold** text).

Leave blank for default timestamp.

<p align="right">(<a href="#top">back to top</a>)</p>


## Licence

[MIT](.LICENSE.txt)

### Image license

Image from: [flickr](https://www.flickr.com/photos/kotomi-jewelry/33599728252) (the original looks much better) <a rel="license" href="http://creativecommons.org/licenses/by-nc/2.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/2.0/88x31.png" /></a><br />This image is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/2.0/">Creative Commons Attribution-NonCommercial 2.0 Generic License</a>.

### Font License

[OFL](./OFL.txt)
<p align="right">(<a href="#top">back to top</a>)</p>


## Acknowledgments

This plugin is a partially is inspired by [Obsidian rollover daily todo](https://github.com/shichongrui/obsidian-rollover-daily-todos), thanks!
The project was started by Alex Qwxlea.
The original version can be found at [https://github.com/QWxleA/logseq-interstitial-heading-plugin](https://github.com/QWxleA/)
 

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[release-url]: (https://github.com/QWxleA/logseq-interstitial-heading-plugin)
[release-shield]: https://img.shields.io/github/v/release/qwxlea/logseq-interstitial-heading-plugin?style=for-the-badge
[contributors-shield]: https://img.shields.io/github/contributors/QWxleA/logseq-interstitial-heading-plugin.svg?style=for-the-badge
[contributors-url]: https://github.com/QWxleA/logseq-interstitial-heading-plugin/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/QWxleA/logseq-interstitial-heading-plugin.svg?style=for-the-badge
[forks-url]: https://github.com/QWxleA/logseq-interstitial-heading-plugin/network/members
[stars-shield]: https://img.shields.io/github/stars/QWxleA/logseq-interstitial-heading-plugin.svg?style=for-the-badge
[stars-url]: https://github.com/QWxleA/logseq-interstitial-heading-plugin/stargazers
[issues-shield]: https://img.shields.io/github/issues/QWxleA/logseq-interstitial-heading-plugin.svg?style=for-the-badge
[issues-url]: https://github.com/QWxleA/logseq-interstitial-heading-plugin/issues
[license-shield]: https://img.shields.io/github/license/QWxleA/logseq-interstitial-heading-plugin.svg?style=for-the-badge
[license-url]: https://github.com/QWxleA/logseq-interstitial-heading-plugin/blob/master/LICENSE.txt
