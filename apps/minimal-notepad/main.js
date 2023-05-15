import { openDB } from './idb-7.1.1.js';
function timeout(ms) {
    let id, resolve, reject;
    let p = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
        id = setTimeout(resolve, ms);
    });
    p.endEarly = resolve;
    p.cancel = () => {
        clearTimeout(id);
        reject();
    };
    return p;
}

let text = document.getElementById("content");
let notelist = document.getElementById("notelist");
const dialog = document.getElementById("note-rename-dialog");
const dialog_input = dialog.querySelector("input");
const dialog_form = dialog.querySelector("form");
const searchbar = document.getElementById("search");
let storage;
let current_note;
let saveTimer;


function timestamp() {
    const today = new Date();
    return today.toISOString().slice(0,10);
}
let defaultMessage = timestamp() + ": App initialized.";

async function init() {
    if (!("indexedDB" in window))
        return complain();

    try {
        const registration = await navigator.serviceWorker.register('sw.js');

        if (registration.installing) {
            console.log("Installing");
        } else if (registration.waiting){
            console.log("Service worker installed");
        } else if (registration.active) {
            console.log("Service worker active");
        }
    } catch (error) {
        complain_sw();
    }

    /* attempt creation of IndexedDB storage */
    let db;
    try {
        db = await openDB("minimal-notepad", 1, {
            upgrade(db, oldver, newver, transaction) {
                db.createObjectStore("notes");
                var str = defaultMessage;
                transaction.objectStore("notes").add(str, "quicknote");
            },
        });
    } catch (e) {
        return complain();
    }

    db.onerror = e => console.error(`Database error: ${e.target.errorCode}`);
    storage = {
        _db: db,
        _titles: undefined,
        async _loadtitles() {
            this._titles = await this._db.getAllKeys("notes");
            /* version sort */
            /* re matches always start with a possibly empty non-digit string */
            const re = /^\D*|\d+|\D+/g;
            let fragments = this._titles.map(s => s.match(re));
            fragments.sort(fcomp);
            this._titles = fragments.map(ff => ff.join(""));

            function fcomp(ff1, ff2) {
                ff1 = ff1.slice();
                ff2 = ff2.slice();
                let mode = "s"; /* string or number */
                while (ff1.length || ff2.length) {
                    let f1 = ff1.shift();
                    let f2 = ff2.shift();
                    if (mode === "n") {
                        f1 = parseInt(f1);
                        f2 = parseInt(f2);
                    }
                    mode = (mode === "s") ? "n" : "s";
                    if (f1 < f2) return -1
                    else if (f1 > f2) return 1;
                }
                return 0;
            }
        },
        titles() {
            return this._titles;
        },
        async load(title) {
            const tr = this._db.transaction("notes");
            return tr.objectStore("notes").get(title);
        },
        async save(title, body) {
            const tr = this._db.transaction("notes", "readwrite");
            const result = await tr.objectStore("notes").put(body, title);
            await this._loadtitles();
        },
        async delete(title) {
            await this._db.delete("notes", title);
            await this._loadtitles();
        },
        async rename(oldtitle, newtitle) {
            const tr = this._db.transaction("notes", "readwrite");
            let obs = tr.objectStore("notes");

            /* check the transaction won't fail */
            if (undefined === await obs.getKey(oldtitle))
                throw new Error("Old title does not exist.", { cause: oldtitle });
            if (undefined !== await obs.getKey(newtitle))
                throw new Error("New title already exists.", { cause: newtitle });

            /* perform the rename */
            const body = await obs.get(oldtitle);
            obs.delete(oldtitle);
            obs.put(body, newtitle);

            await this._loadtitles();
            return tr.done;
        }
    };
    await storage._loadtitles();

    await openDefaultNote();
    initUI();
}

await init();

function complain() {
    document.querySelector(".error").classList.add("active");
}
function complain_sw() {
    defaultMessage =
`Service workers are disabled.
Your changes will be saved, but the app will not work offline.`;
    console.log("Please enable service workers.")
}

async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register(
        "/sw.js",
        { scope: "/" }
    );
    if (registration.installing) {
        console.log("Installing");
    } else if (registration.waiting){
        console.log("Service worker installed");
    } else if (registration.active) {
        console.log("Service worker active");
    } 
}

function toggleNoteList(visibility) {
    const hint = (visibility === "visible") ? true
        : (visibility === "hidden") ? false
        : undefined;
    notelist.classList.toggle("active", hint);
}
function toggleErrorPopup(visibility) {
    const hint = (visibility === "visible") ? true
        : (visibility === "hidden") ? false
        : undefined;
    dialog.querySelector(".tooltip").classList.toggle("active", hint);
}

function renderNoteList(titles) {
    return titles.map(renderNote).join("");
}

function renderNote(title) {
    return `\
<li
    class="note"
    aria-selected="${title === current_note}"
>${title}</li>`;
}

function initUI() {
    updateNoteList();
    text.addEventListener("input", () => {
        if (saveTimer !== undefined)
            saveTimer.timeout.cancel();

        let _timeout = timeout(2000);
        let _action = _timeout.then(() => {
            storage.save(current_note, text.value);
            document.getElementById("app").classList.remove("dirty");
            saveTimer = undefined;
        }).catch(() => {});
        saveTimer = { timeout: _timeout, action: _action };
        document.getElementById("app").classList.add("dirty");
    });
    document.getElementById("hamburger").onclick = () => toggleNoteList();
    document.getElementById("note-add").onclick = () => noteAdd();
    notelist.onclick = e => {
        if (e.target === notelist) return;
        noteLoad(e.target.textContent);
        toggleNoteList("hidden");
    };
    document.getElementById("note-delete").onclick = () => noteDelete();
    document.getElementById("note-rename").onclick = () => showRenameDialog();
    dialog.onclose = () => {
        if (dialog.returnValue !== "ok") return;
        const text = dialog.getElementsByTagName("input")[0].value;
        noteRename(text);
    };
    dialog_input.oninput = () => validateNewName();
    dialog_input.onchange = () => validateNewName();
    dialog_form.onsubmit = preventInvalidRename;
    dialog.querySelector("button[type='button']").onclick = () => dialog.close();
    searchbar.oninput = () => {
        toggleNoteList("visible");
        updateNoteList();
    }
    searchbar.onkeydown = e => {
        if (["Escape", "Esc"].includes(e.key)) {
            toggleNoteList("hidden");
            text.focus();
            searchbar.value = "";
            updateNoteList();
        }
        if (e.key === "Enter") {
            e.preventDefault();     // don't submit the form
            if (notelist.children.length) {
                notelist.children[0].dispatchEvent(new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                }));
            }
        }
    }
}

async function updateNoteList() {
    const q = searchbar.value;
    let titles = await storage.titles();
    let re_forwards, re_backwards;
    if (q.length) {
        re_forwards = RegExp(q.split("").join(".*?"));
        re_backwards = RegExp(q.split("").reverse().join(".*?"));
        titles = titles
            .map(s => [s, fuzzymatch(s)])
            .filter(([ , n]) => n !== 0)
            .sort(([ , n1], [ , n2]) =>
                n1 === n2 ? 0
                : n1 < n2 ? -1
                : 1)
            .map(([s, ]) => s);
    }
    notelist.innerHTML = renderNoteList(titles);

    function fuzzymatch(s) {
        if (q.match(/^[^A-Z]*$/))
            s = s.toLocaleLowerCase();
        const m1 = s.match(re_forwards);
        if (m1 === null) return 0;
        const m2 = m1[0].split("").reverse().join("").match(re_backwards);
        if (m2 === null) return 0;
        return m2[0].length;
    }
}


async function openDefaultNote() {
    const titles = await storage.titles();
    if (!titles.length)
        return noteAdd();
    const default_note = titles.includes("quicknote") ? "quicknote"
        : titles[0];
    noteLoad(default_note);
}

function showRenameDialog() {
    let input = dialog.getElementsByTagName("input")[0];
    input.value = current_note;
    dialog.returnValue = "";
    toggleErrorPopup("hidden");
    dialog.showModal();
}



/* form validation */
function preventInvalidRename(e) {
    /* force validation to prevent submission of the invalid default state */
    validateNewName();
    console.log(e.submitter, dialog_input.validationMessage);
    if (dialog_input.validationMessage !== "") {
        dialog.querySelector(".tooltip").innerText = dialog_input.validationMessage;
        toggleErrorPopup("visible");
        e.preventDefault();
    }
}
function validateNewName() {
    if (storage.titles().includes(dialog_input.value)) {
        dialog_input.setCustomValidity(`"${ dialog_input.value }" already exists`);
    } else {
        dialog_input.setCustomValidity("");
    }
}



/* UI handlers */
async function noteAdd() {
    const titles = await storage.titles();
    const title = (titles.length === 0) ? "quicknote"
        : (!titles.includes("quicknote")) ? "quicknote"
        : getNewUntitle();

    await storage.save(title, "");
    updateNoteList();
    await noteLoad(title);

    function getNewUntitle() {
        /* find all the "untitledX" titles, keep the X part */
        let candidates = titles
            .filter(t => t.startsWith("untitled"))
            .map(t => t.slice("untitled".length));
        const re = /^[1-9][0-9]*$/;     /* is X a sensible integer? */
        /* find the last integer X */
        const posfix = candidates.reverse().find(pf => pf.match(re) !== null)
            || 0;
        return "untitled".concat(parseInt(posfix) + 1);
    }
};
async function noteDelete(title = current_note) {
    if (saveTimer !== undefined)
        saveTimer.timeout.cancel();
    await storage.delete(title);
    await openDefaultNote();
    updateNoteList();
}
async function noteLoad(title) {
    if (saveTimer !== undefined) {
        saveTimer.timeout.endEarly();
        await saveTimer.action;
    }
    current_note = title;
    updateNoteList();
    text.value = await storage.load(current_note);
}
async function noteRename(newtitle) {
    if (saveTimer !== undefined) {
        saveTimer.timeout.endEarly();
        await saveTimer.action;
    }
    await storage.rename(current_note, newtitle);
    current_note = newtitle;
    updateNoteList();
}
