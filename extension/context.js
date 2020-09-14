(function () {
	'use strict';

	function getIndexFile(_ref) {
	  var content = _ref.content,
	      imports = _ref.imports;
	  return "import React from 'react';\nimport ReactDOM from 'react-dom';\n".concat(imports, "\n\nconst App = () => (\n    <React.Fragment>\n        ").concat(content, "\n    </React.Fragment>\n)\n\nReactDOM.render(\n  <App />,\n  document.getElementById('root')\n);");
	}

	function getReactFiles(_ref2) {
	  var content = _ref2.content,
	      imports = _ref2.imports;
	  return {
	    'package.json': {
	      content: {
	        dependencies: {
	          react: 'latest',
	          'react-dom': 'latest'
	        }
	      }
	    },
	    'index.js': {
	      content: getIndexFile({
	        content: content,
	        imports: imports
	      })
	    },
	    'index.html': {
	      content: '<div id="root"></div>'
	    }
	  };
	}

	// import { parse, print } from 'recast';

	var getTemplateFiles = function getTemplateFiles(_ref) {
	  var template = _ref.template,
	      code = _ref.content;

	  // const ast = parse(code, {
	  // 	parser,
	  // });
	  // ast.program.body = ast.program.body.filter((item) => item.type !== 'ImportDeclaration');
	  // const content = print(ast).code;
	  switch (template) {
	    case 'react':
	      {
	        return getReactFiles({
	          content: code,
	          "import": ''
	        });
	      }

	    default:
	      {
	        return {};
	      }
	  }
	};

	var getSandboxURL = function getSandboxURL(params) {
	  return fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json',
	      Accept: 'application/json'
	    },
	    body: JSON.stringify({
	      files: getTemplateFiles(params)
	    })
	  });
	};

	chrome.runtime.onInstalled.addListener(function runtimeListener() {
	  chrome.contextMenus.create({
	    title: 'Open in CodeSandbox',
	    id: 'parent',
	    contexts: ['selection']
	  });
	  chrome.contextMenus.create({
	    title: 'React',
	    parentId: 'parent',
	    id: 'react',
	    contexts: ['selection']
	  });
	  chrome.contextMenus.create({
	    title: 'Vanilla',
	    parentId: 'parent',
	    id: 'vanilla',
	    contexts: ['selection']
	  });
	});
	chrome.contextMenus.onClicked.addListener(function clickListener(clickData) {
	  switch (clickData.menuItemId) {
	    case 'react':
	      {
	        getSandboxURL({
	          template: 'react',
	          content: clickData.selectionText
	        }).then(function (r) {
	          return r.json();
	        }).then(function (data) {
	          chrome.tabs.create({
	            url: "https://codesandbox.io/s/".concat(data.sandbox_id)
	          });
	        });
	        break;
	      }

	    default:
	      {
	        console.log('Nothing');
	      }
	  }
	});

}());
//# sourceMappingURL=context.js.map
