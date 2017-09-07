JSONEditor.defaults.options.theme = "bootstrap3";
JSONEditor.defaults.options.iconlib = "fontawesome4";

JSONEditor.defaults.options.disable_collapse = true;
JSONEditor.defaults.options.show_errors = "change";
JSONEditor.defaults.options.disable_edit_json = true;
JSONEditor.defaults.options.disable_properties = true;

exports.editor = new JSONEditor(document.getElementById("editor_holder"), {
  schema: {
    title: "Book",
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "* Titolo del libro",
        minLength: 1
      },
      description: {
        type: "string",
        format: "textarea",
        description: "Sinossi"
      },
      publisher: {
        type: "string",
        description: "* Editore",
        minLength: 1
      },
      language: {
        type: "string",
        description: "Lingua ISO 639-2 (ita, eng, fra, ger)"
      },
      subject: {
        type: "string",
        description: "Soggetti o keywords (separati da virgola)"
      },
      rights: {
        type: "string",
        enum: ["open access", "closed access"],
        description: "Licenza"
      },
      date: {
        type: "string",
        description: "* Data di pubblicazione",
        minLength: 1
      },
      creator: {
        type: "array",
        minItems: 1,
        format: "table",
        title: "Creators",
        uniqueItems: true,
        items: {
          type: "object",
          title: "Creator",
          properties: {
            type: {
              type: "string",
              enum: ["author", "translator", "contributor"],
              default: "author"
            },
            name: {
              type: "string",
              description: "* Nome e cognome",
              minLength: 1
            }
          }
        }
      },
      identifiers: {
        type: "array",
        minItems: 1,
        maxItems: 4,
        format: "table",
        title: "Identifiers",
        uniqueItems: true,
        items: {
          type: "object",
          title: "Identifier",
          properties: {
            type: {
              type: "string",
              enum: ["URL", "ISBN", "ISSN", "DOI", "other"],
              default: "URL"
            },
            ID: { type: "string" }
          },
          required: ["type"],
          additionalProperties: false
        }
      }
    }
  }
});
