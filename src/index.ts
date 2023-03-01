export interface Dictionary {
  [key: string]: string;
}

export type Template = string;

export interface MigascTemplateOptions {
  /**
   * The replacement value for template matches with no dictionary reference.
   * @defaultValue `''`
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { dict404: '__NOT_FOUND__' },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *   }
   * );
   *
   * const template = '{{animal}} are a {{adjective}} kind of folk - {{author}}';
   *
   * mt.compile(template);
   * // -> Cats are a mysterious kind of folk - __NOT_FOUND__
   * ```
   */
  dict404?: string;

  /**
   * Allow escape character `'!'` before the opening tag to escape tags.
   * Do not allow for better performance.
   *
   * Note: If possible, it is advised to change `options.tags` opposed to enabling this option.
   * @defaultValue `false`
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowEscapeChar: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *     date: new Date().toDateString(),
   *   }
   * );
   *
   * const template =
   *   '{{animal}} are a {{adjective}} kind of folk - {{author}} : !{{date}} -> {{date}}.';
   *
   * mt.compile(template);
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott : {{date}} -> Sat Feb 18 2023.
   * ```
   */
  doAllowEscapeChar?: boolean;

  /**
   * Allow whitespace between the opening/closing tags and the template content.
   *
   * `options.maxWhitespace` value is only relevent if `options.doAllowWhitespace` is true.
   * Do not allow for better performance.
   * @defaultValue `false`
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template = '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.compile(template);
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott
   * ```
   */
  doAllowWhitespace?: boolean;

  /**
   * Set the maximum number of valid characters.
   * @defaultValue `64`
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { maxChars: 6 },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template = '{{animal}} are a {{adjective}} kind of folk - {{author}}';
   *
   * mt.compile(template);
   * // -> Cats are a {{adjective}} kind of folk - Sir Walter Scott
   * ```
   */
  maxChars?: number;

  /**
   * Set the maximum number of valid whitespace characters between the opening/closing tags and the template content.
   * This is disregarded when `doAllowWhiteSpace` is `false`.
   * @defaultValue `64`
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   {
   *     doAllowWhitespace: true,
   *     maxWhitespace: 1,
   *   },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template = '{{ animal }} are a {{ adjective }} kind of folk - {{  author  }}';
   *
   * mt.compile(template);
   * // -> Cats are a mysterious kind of folk - {{  author  }}
   * ```
   */
  maxWhitespace?: number;

  /**
   * Define tags configuration.
   */
  tags?: {
    /**
     * Define characters to use as opening tags.
     * @defaultValue `'}}'`
     */
    close?: string;

    /**
     * Define characters to use as closing tags.
     * @defaultValue `'{{'`
     */
    open?: string;
  };

  /**
   * Define valid characters and/or character ranges (e.g. `'a-z'`).
   * @defaultValue `'a-zA-Z0-9_-'`
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { validChars: 'a-z' },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template = '{{animal}} are a {{ADJECTIVE}} kind of folk - {{author}}';
   *
   * mt.compile(template);
   * // -> Cats are a {{ADJECTIVE}} kind of folk - Sir Walter Scott
   * ```
   */
  validChars?: string;
}

type TemplateMap = { [key: string]: Array<number> };
type TemplateModel = Array<string>;

export default class MigascTemplate {
  /**
   * A dictionary of replacement values using the key:value pair structure.
   */
  private _dict!: Dictionary;

  /**
   * Default replacement value for template matches not defined in the dictionary.
   */
  private _dict404!: string;

  /**
   * Configuration object defining the template language limitations.
   */
  private _options: MigascTemplateOptions = {
    dict404: '',
    doAllowEscapeChar: false,
    doAllowWhitespace: false,
    maxChars: 64,
    maxWhitespace: 64,
    tags: {
      close: '}}',
      open: '{{',
    },
    validChars: 'a-zA-Z0-9_-',
  };

  /**
   * Regular expression used to replace template text.
   * @defaultValue `/{{([a-zA-Z0-9_-]{1,64})}}/g`
   */
  private _regexp: RegExp;

  /**
   * Raw template.
   * @defaultValue `''`
   */
  private _template: string = '';

  /**
   * Template map.
   * @defaultValue `{}`
   */
  private _templateMap: TemplateMap = {};

  /**
   * Template model.
   * @defaultValue `[]`
   */
  private _templateModel: TemplateModel = [];

  /**
   * Templating engine to produce the compiled string.
   * @param template - Template.
   * @param dict - Dictionary.
   * @returns The compiled string.
   */
  private _engine: (template: Template, dict: Dictionary) => string;

  /**
   * Templating engine to produce the compiled string using a precompiled map and model.
   * @param dict - Dictionary to use.
   * @returns The compiled string.
   */
  private _templateEngine = (dict: Dictionary): string => {
    const templateMap = { ...this._templateMap };
    const templateModel = [...this._templateModel];

    for (let i = 0, keys = Object.keys(dict), l = keys.length; i < l; i++) {
      const key = keys[i];
      if (templateMap[key] !== undefined) {
        for (let ii = 0, ll = templateMap[key].length; ii < ll; ii++) {
          templateModel[templateMap[key][ii]] = dict[key];
        }
      }
    }

    return ''.concat(...templateModel);
  };

  /**
   * Map the given template.
   * @param template - Template.
   */
  private _map = (template: Template): void => {
    const dict404 = this.getDict404();
    const doAllowEscapeChar = !!this._options.doAllowEscapeChar;
    const regexp = this._regexp;
    const templateMap: TemplateMap = {};
    const templateModel: TemplateModel = [];
    let lastSliceIndex = 0;
    let execMatch: RegExpExecArray | null = null;

    while ((execMatch = regexp.exec(template)) !== null) {
      // Escaped tags
      if (doAllowEscapeChar && execMatch[0][0] === '!') {
        templateModel.push(
          template.slice(lastSliceIndex, execMatch.index),
          template.slice(execMatch.index + 1, regexp.lastIndex)
        );
        lastSliceIndex = regexp.lastIndex;
        continue;
      }

      const definition = execMatch[1];

      // Create array for definition if one does not exist
      if (!templateMap[definition]) {
        templateMap[definition] = [];
      }

      // Add template text to array and a `dict404` placeholder string for dictionary insertion
      templateModel.push(
        template.slice(lastSliceIndex, execMatch.index),
        dict404
      );

      // Add dictionary insertion index
      templateMap[definition].push(templateModel.length - 1);

      lastSliceIndex = regexp.lastIndex;
    }

    // Add the last template text
    templateModel.push(template.slice(lastSliceIndex));

    // Set instance values
    this._templateMap = { ...templateMap };
    this._templateModel = [...templateModel];
  };

  /**
   * Return the current global dictionary.
   * @remarks
   * Property accessors (getters/setters) are not used for ES3 compatibility.
   * @returns The global dictionary.
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template = '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * const localDict = {
   *   author: 'Michael Scott',
   * };
   *
   * mt.compile(template, {
   *   ...mt.getDict(),
   *   ...localDict,
   * });
   * // -> Cats are a mysterious kind of folk - Michael Scott
   * ```
   */
  public getDict(): Dictionary {
    return this._dict;
  }

  /**
   * Update the global dictionary.
   * @param dict - The new global dictionary.
   * @remarks
   * The `dict` parameter is the new global dictionary of replacement values using the key:value pair structure.
   *
   * Property accessors (getters/setters) are not used for ES3 compatibility.
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(undefined,
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template = '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.setDict({
   *   adjective: 'special',
   *   animal: 'Kevins',
   *   author: 'Michael Scott',
   * });
   *
   * mt.compile(template);
   * // -> Kevins are a special kind of folk - Michael Scott
   * ```
   */
  public setDict(dict: Dictionary): void {
    this._dict = { ...dict };
  }

  /**
   * Return the current default value for any undefined dictionary values.
   * @remarks
   * Property accessors (getters/setters) are not used for ES3 compatibility.
   * @returns The default value for any undefined dictionary values.
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate({
   *   dict404: '__NOT_FOUND__',
   * });
   *
   * mt.getDict404();
   * // -> __NOT_FOUND__
   * ```
   */
  public getDict404(): string {
    return this._dict404;
  }

  /**
   * Update the default value for any undefined dictionary values.
   * @param dict404 - The new default value for any undefined dictionary values.
   * @remarks
   * Based off the well-known 404 HTTP error response status code -
   * `dict404` is the default replacement string for any undefined dictionary values.
   *
   * Property accessors (getters/setters) are not used for ES3 compatibility.
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate({
   *   dict404: '__NOT_FOUND__',
   * });
   *
   * mt.setDict404('!FOUND');
   *
   * mt.getDict404();
   * // -> !FOUND
   * ```
   */
  public setDict404(dict404: string): void {
    this._dict404 = dict404;
  }

  /**
   * Return the current raw template.
   * @remarks
   * Get the current instance template as is from input.
   *
   * Property accessors (getters/setters) are not used for ES3 compatibility.
   * @returns The raw template.
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate();
   *
   * const template =
   *   '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.setTemplate(template);
   *
   * mt.getTemplate();
   * // -> {{ animal }} are a {{ adjective }} kind of folk - {{ author }}
   * ```
   */
  public getTemplate(): Template {
    return this._template;
  }

  /**
   * Precompile a template.
   * @param template - Template.
   * @remarks
   * Property accessors (getters/setters) are not used for ES3 compatibility.
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template =
   *   '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.setTemplate(template);
   *
   * mt.template();
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott
   *
   * mt.getTemplate();
   * // -> {{ animal }} are a {{ adjective }} kind of folk - {{ author }}
   * ```
   */
  public setTemplate(template: Template): void {
    this._map(template);
    this._template = template;
  }

  /**
   * Compile a given template into plain text using a defined dictionary.
   * If `dict` is omitted, the instance global dictionary will be used.
   * @param template - Template.
   * @param dict - Local dictionary (supersedes global dictionary).
   * @returns The compiled string.
   * @example
   * Use the global dictionary.
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template =
   *   '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.compile(template);
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott
   * ```
   * @example
   * Use a local dictionary.
   *
   * It is possible to merge the global and local dictionaries.
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template =
   *   '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.compile(template);
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott
   *
   * const localDict = {
   *   author: 'Michael Scott',
   * };
   *
   * mt.compile(template, { ...mt.getDict(), ...localDict });
   * // -> Cats are a mysterious kind of folk - Michael Scott
   * ```
   */
  public compile(template: Template, dict?: Dictionary): string {
    return this._engine(template, dict ? { ...dict } : { ...this.getDict() });
  }

  /**
   * Compile preset template into plain text using a defined dictionary.
   * If `dict` is omitted, the instance global dictionary will be used.
   * @param dict - Local dictionary (supersedes global dictionary).
   * @returns The compiled string.
   * @example
   * Use the global dictionary.
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template =
   *   '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.setTemplate(template);
   *
   * mt.template();
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott
   * ```
   * @example
   * Use a local dictionary.
   *
   * It is possible to merge the global and local dictionaries.
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const mt = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template =
   *   '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * mt.setTemplate(template);
   *
   * mt.template();
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott
   *
   * const localDict = {
   *   author: 'Michael Scott',
   * };
   *
   * mt.template({ ...mt.getDict(), ...localDict });
   * // -> Cats are a mysterious kind of folk - Michael Scott
   * ```
   */
  public template(dict?: Dictionary): string {
    return this._templateEngine(dict ? { ...dict } : { ...this.getDict() });
  }

  /**
   * Creates an instance of the template engine.
   * @param options - Configuration object defining the template language limitations.
   * @param dict - Initialize the dictionary object using the key:value pair structure.
   * @example
   * ```js
   * import MigascTemplate from 'migasc-template';
   *
   * const template = new MigascTemplate(
   *   // MigascTemplate Options
   *   { doAllowWhitespace: true },
   *   // MigascTemplate Dictionary
   *   {
   *     adjective: 'mysterious',
   *     animal: 'Cats',
   *     author: 'Sir Walter Scott',
   *   }
   * );
   *
   * const template = '{{ animal }} are a {{ adjective }} kind of folk - {{ author }}';
   *
   * template.compile(template);
   * // -> Cats are a mysterious kind of folk - Sir Walter Scott
   * ```
   */
  constructor(options?: MigascTemplateOptions, dict?: Dictionary) {
    // Set the local config with user config with default fallback
    this._options = {
      ...this._options,
      ...options,
      ...{
        tags: {
          ...this._options.tags,
          ...options?.tags,
        },
      },
    };

    // Set the local copy of the dictionary
    this.setDict(dict || {});

    // Set the default replacement value
    this.setDict404(this._options.dict404 as string);

    // Set valid whitespace based on config
    const whitespace = this._options.doAllowWhitespace
      ? `\\s{0,${this._options.maxWhitespace}}`
      : '';

    // Set regular expression
    this._regexp = new RegExp(
      `${this._options.doAllowEscapeChar ? '!?' : ''}${
        this._options.tags!.open
      }${whitespace}([${this._options.validChars}]{1,${
        this._options.maxChars
      }})${whitespace}${this._options.tags!.close}`,
      'g'
    );

    // Set the template engine
    // Note: Allowing escape character creates one extra conditional evaluation per match,
    // Each true evaluation requires a string manipulation step
    this._engine = this._options.doAllowEscapeChar
      ? (template: Template, dict: Dictionary): string => {
          return template.replace(this._regexp, (match, definition) => {
            return match[0] === '!'
              ? match.slice(1)
              : dict[definition] || this._dict404;
          });
        }
      : (template: Template, dict: Dictionary): string => {
          return template.replace(this._regexp, (_match, definition) => {
            return dict[definition] || this._dict404;
          });
        };
  }
}
