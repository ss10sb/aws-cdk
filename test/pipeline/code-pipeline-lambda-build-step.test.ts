// BuildSpec: '{\n' +
// '  "version": "0.2",\n' +
// '  "phases": {\n' +
// '    "build": {\n' +
// '      "commands": [\n' +
// '        "cd codebase",\n' +
// '        "mv resources.copy resources && mv config.copy config && mv public.copy public",\n' +
// '        "npm ci",\n' +
// '        "npm run prod",\n' +
// '        "rm -rf node_modules",\n' +
// '        "cd ..",\n' +
// '        "cp config/_common.js.copy config/_common.js && cp config/defaults.js.copy config/defaults.js",\n' +
// '        "npm ci",\n' +
// '        "npm run build",\n' +
// '        "npx cdk synth"\n' +
// '      ]\n' +
// '    }\n' +
// '  },\n' +
// '  "artifacts": {\n' +
// '    "base-directory": "cdk.out",\n' +
// '    "files": "**/*"\n' +
// '  }\n' +
// '}'