"use strict";
const testbutton = document.getElementById('test');
const testInfo = document.getElementById("testInfo");
const proxyform = document.getElementById('proxyform');
const proxyinfo = document.getElementById("proxyinfo");
const bypassform = document.getElementById('bypassform');
const bypassinfo = document.getElementById("bypassinfo");
if (testbutton)
    testbutton.addEventListener("click", () => {
        chrome.storage.local.get("host").then(msg => {
            log(JSON.stringify(msg));
        });
    });
if (proxyform)
    proxyform.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const str = String(formData.get("proxy"));
        if (str == "") {
            cancelProxy();
            return;
        }
        if (!str.includes(":")) {
            log("no colon in settings ");
            return;
        }
        const proxy = {
            host: str.split(":")[0],
            port: str.split(":")[1]
        };
        chrome.storage.local.set({ proxy: proxy }).then(() => {
            setProxy();
        });
    });
function log(...err) {
    if (testInfo)
        testInfo.innerText = `${new Date().toLocaleTimeString()} ${err.join(" ")} \n` + testInfo.innerText;
}
function updateInfo() {
    log('update info');
    if (proxyinfo) {
        chrome.proxy.settings.get({}, (config) => {
            var _a, _b;
            proxyinfo.innerText = `
    mode: ${config.value.mode}
    httpServer: ${(_a = config.value.rules) === null || _a === void 0 ? void 0 : _a.singleProxy.host} :${(_b = config.value.rules) === null || _b === void 0 ? void 0 : _b.singleProxy.port}
    `;
        });
    }
    if (bypassinfo) {
        //todo
        bypassinfo.innerText = ``;
    }
}
function cancelProxy() {
    log('cancelling proxy');
    var noProxyconfig = {
        mode: "direct",
    };
    chrome.proxy.settings.set({
        value: noProxyconfig,
        scope: "regular"
    }, () => {
        log("proxy cleared");
        updateInfo();
    });
}
function setProxy() {
    log('setting proxy');
    chrome.storage.local.get("proxy").then((json) => {
        var config = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    host: json.proxy.host,
                    port: parseInt(json.proxy.port)
                }
            }
        };
        chrome.proxy.settings.set({
            value: config,
            scope: "regular"
        }, () => {
            updateInfo();
        });
    });
}
updateInfo();
