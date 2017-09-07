const { app } = require("electron").remote;
const { ipcRenderer } = require("electron");

const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const zipfolder = require("zip-folder");
const rimraf = require("rimraf");
const opn = require("opn");
const BagIt = require("bagit-fs");
const Readable = require("stream").Readable;
const tmp = require("tmp");

//
const { calculate_checksum } = require("./extra");
const { editor } = require("./editor");
//
const allowed_files = [".pdf", ".epub"];
const desktop_dir = path.join(app.getPath("desktop"), "BNCF-Bookdeposit");

// html elements
const dropbox = document.getElementById("dropbox");
const uploaded = document.getElementById("uploaded");
const sha1 = document.getElementById("sha1");
const reveal = document.getElementById("reveal");
const indicator = document.getElementById("valid_indicator");
const editor_holder = document.getElementById("editor_holder");
const metadata = document.getElementById("metadata");
const text_extraction = document.getElementById("text_extraction");
const checkbox_text_extraction = document.getElementById(
  "allow_text_extraction"
);

var uploaded_name;
var upload_slug;
var tmp_output;

dropbox.ondragover = () => {
  return false;
};

dropbox.ondragleave = dropbox.ondragend = () => {
  return false;
};

dropbox.ondrop = e => {
  e.preventDefault();
  for (let f of e.dataTransfer.files) {
    uploaded_path = f.path;
    uploaded_ext = path.extname(uploaded_path);
    uploaded_filename = path.basename(uploaded_path);
    uploaded_name = path.basename(uploaded_path, uploaded_ext);
    upload_slug = slugify(uploaded_name);

    if (allowed_files.indexOf(uploaded_ext) > -1) {
      uploaded.innerHTML = `<b>${uploaded_filename}</b>`;

      calculate_checksum(uploaded_path, function(checksum) {
        sha1.innerHTML = `<small>sha256: ${checksum}</small>`;
        reveal.style.visibility = "visible";
        indicator.style.visibility = "visible";

      });

      dropbox.parentNode.removeChild(dropbox);
    } else {
      window.alert("Puoi depositare soltanto file .pdf e .epub");
    }
  }

  return false;
};

editor.on("change", function() {
  var errors = editor.validate();
  
  if (errors.length) {
    indicator.className = "label label-danger";
    indicator.textContent = "↓ compilare tutti i metadati";
  } else {
    indicator.className = "label label-success";
    indicator.textContent = "metadati completi";
    document.getElementById("create_bag").removeAttribute("disabled");
  }
});

document.getElementById("create_bag").addEventListener("click", function() {
  //
  if (checkbox_text_extraction.checked) {
    bagit_option = { "Bagit-Profile-Identifier": "ALLOW_TEXT_EXTRACTION" };
  } else {
    bagit_option = "";
  }

  var tmpdir = tmp.dirSync();
  tmp_output = path.join(tmpdir.name, upload_slug);

  try {
    fs.mkdirSync(tmp_output);
  } catch (err) {
    window.alert("Errore: bag già esistente in Desktop/BNCF-Bookdeposit");
    return false;
  }

  var bag = BagIt(tmp_output, "sha256", bagit_option);

  // add full-text to bag
  fs
    .createReadStream(uploaded_path)
    .pipe(bag.createWriteStream(`/${uploaded_filename}`));

  // add json metadata to bag
  var meta = new Readable();
  var metadata_json = JSON.stringify(editor.getValue());
  meta.push(metadata_json);
  meta.push(null);
  meta.pipe(bag.createWriteStream(`/${uploaded_name}.json`));

  // finalize bag
  bag.finalize(function() {
    console.log("finalized");

    zipfolder(
      tmpdir.name,
      `${path.join(desktop_dir, upload_slug)}.zip`,
      function(err) {
        if (err) {
          console.log("error writing zip file", err);
        } else {
          rimraf(tmp_output, function(err) {
            if (err) {
              throw err;
            }
          });
        }
      }
    );
  });

  document.getElementById("create_bag").style.visibility = "hidden";
  metadata.removeChild(editor_holder);
  metadata.removeChild(text_extraction);
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  document.getElementById("confirm_message").style.visibility = "visible";
});

document.getElementById("opendesktop").addEventListener("click", function() {
  opn(desktop_dir, { wait: false });
});

document.getElementById("reload").addEventListener("click", function() {
  ipcRenderer.send("reload", "");
});
