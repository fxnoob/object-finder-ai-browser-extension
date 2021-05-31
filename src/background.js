import "@babel/polyfill";
import chromeService from "./services/chromeService";
import Routes from "./routes";
import messagePassing from "./services/messagePassing";
import constants from "../constants";
import db, { schema } from "./services/dbService";
import Constants from "../constants";
import { DataStore, generateGuid } from "./services/helper";
/**
 * Main extension functionality
 *
 * @class Main
 */
class Main {
  constructor() {
    this.ctxMenuId1 = null;
    this.ctxMenuId2 = null;
    this.init().catch((e) => {
      console.log("Error loading extension", { e });
    });
    // set feedback form url
    this.setFeedbackFormUrl();
  }
  init = async () => {
    await this.initDb();
    await Routes();
    this.initContextMenu();
    this.popUpClickSetup();
  };
  /**
   * initialize db settings
   * @method
   * @memberof Main
   */
  initDb = async () => {
    const res = await db.get("___loaded");
    if (!res.hasOwnProperty("___loaded")) {
      await db.set({ ___loaded: true, ...schema.data });
      chromeService.openHelpPage("welcome");
      this.mountCSOnPreviouslyOpenedTabs().catch(() => {});
    }
  };
  openCropWindow = async () => {
    const screenshotUrl = await chromeService.takeScreenShot();
    await messagePassing.sendMessageToActiveTab(
      "/show_popup",
      { screenshotUrl },
      () => {}
    );
  };
  /**
   * mount content script on previously opened tabs
   * @method
   * @memberof Main
   */
  mountCSOnPreviouslyOpenedTabs = async () => {
    chrome.tabs.query({}, (result) => {
      result.map((tabInfo) => {
        messagePassing.sendMessageToTab(
          "/cs_mounted",
          tabInfo.id,
          {},
          async (res) => {
            if (!res) {
              chrome.tabs.executeScript(tabInfo.id, {
                file: "content_script.bundle.js",
              });
            }
          }
        );
      });
    });
  };
  popUpClickSetup = () => {
    chrome.browserAction.onClicked.addListener(this.openCropWindow);
  };
  /**
   * Context menu option initialization
   *
   * @method
   * @memberof Main
   */
  initContextMenu = () => {
    if (this.ctxMenuId1) return;
    const extractTextFromScreenLabel = chromeService.getI18nMessage(
      "labelEditThisScreen"
    ); // Find Object in this Screen
    this.ctxMenuId1 = chromeService.createContextMenu({
      title: extractTextFromScreenLabel,
      contexts: ["all"],
      onclick: this.onContextMenu1Click,
    });
    if (this.ctxMenuId2) return;
    const extractTextFromImageLabel = chromeService.getI18nMessage(
      "labelEditThisImage"
    ); // Find object in this image
    this.ctxMenuId2 = chromeService.createContextMenu({
      title: extractTextFromImageLabel,
      contexts: ["image"],
      onclick: this.onContextMenu2Click,
    });
  };
  onContextMenu1Click = async (info, tab) => {
    this.openCropWindow();
  };
  onContextMenu2Click = async (info, tab) => {
    const { srcUrl } = info;
    const uid = generateGuid();
    DataStore.set(uid, srcUrl);
    const url = `${Constants.appConfig.endpoint}/recognize?id=${uid}`;
    chrome.tabs.query({ url: "https://imagetext.xyz/*" }, (tabs) => {
      const [tab] = tabs;
      if (tab) {
        chrome.tabs.update(tab.id, { url, active: true });
      } else {
        chrome.tabs.create({ url }, () => {});
      }
    });
  };
  /**
   *set feedback form url shown while uninstalling
   * */
  setFeedbackFormUrl = () => {
    chrome.runtime.setUninstallURL(constants.support.uninstallFeedbackForm);
  };
}
// init main
new Main();
