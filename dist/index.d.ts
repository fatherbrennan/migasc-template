interface Dictionary {
    [key: string]: string;
}
type Template = string;
interface MigascTemplateOptions {
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
declare class MigascTemplate {
    /**
     * A dictionary of replacement values using the key:value pair structure.
     */
    private _dict;
    /**
     * Default replacement value for template matches not defined in the dictionary.
     */
    private _dict404;
    /**
     * Configuration object defining the template language limitations.
     */
    private _options;
    /**
     * Regular expression used to replace template text.
     * @defaultValue `/{{([a-zA-Z0-9_-]{1,64})}}/g`
     */
    private _regexp;
    /**
     * Raw template.
     * @defaultValue `''`
     */
    private _template;
    /**
     * Template map.
     * @defaultValue `{}`
     */
    private _templateMap;
    /**
     * Template model.
     * @defaultValue `[]`
     */
    private _templateModel;
    /**
     * Templating engine to produce the compiled string.
     * @param template - Template.
     * @param dict - Dictionary.
     * @returns The compiled string.
     */
    private _engine;
    /**
     * Templating engine to produce the compiled string using a precompiled map and model.
     * @param dict - Dictionary to use.
     * @returns The compiled string.
     */
    private _templateEngine;
    /**
     * Map the given template.
     * @param template - Template.
     */
    private _map;
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
    getDict(): Dictionary;
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
    setDict(dict: Dictionary): void;
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
    getDict404(): string;
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
    setDict404(dict404: string): void;
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
    getTemplate(): Template;
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
    setTemplate(template: Template): void;
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
    compile(template: Template, dict?: Dictionary): string;
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
    template(dict?: Dictionary): string;
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
    constructor(options?: MigascTemplateOptions, dict?: Dictionary);
}

export { Dictionary, MigascTemplateOptions, Template, MigascTemplate as default };
