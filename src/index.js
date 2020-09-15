import { getSandboxURL } from './utils';

const TEMPLATES = [
	{ title: 'React', id: 'react' },
	// { title: 'Vanilla', id: 'vanilla' },
];

chrome.runtime.onInstalled.addListener(function runtimeListener() {
	chrome.contextMenus.create({
		title: 'Open in CodeSandbox',
		id: 'parent',
		contexts: ['selection'],
	});

	TEMPLATES.forEach((template) => {
		chrome.contextMenus.create({
			...template,
			contexts: ['selection'],
			parentId: 'parent',
		});
	});
});

chrome.contextMenus.onClicked.addListener(function clickListener(clickData) {
	switch (clickData.menuItemId) {
		case 'react': {
			chrome.tabs.executeScript(
				{
					code: 'window.getSelection().toString();',
				},
				function executeHandler(selection) {
					getSandboxURL({
						template: clickData.menuItemId,
						code: selection[0],
					})
						.then((res) => res.json())
						.then((data) => {
							chrome.tabs.create({
								url: `https://codesandbox.io/s/${data.sandbox_id}`,
							});
						})
						.catch((e) => {
							console.error(e.message || 'Something went wrong.');
						});
				},
			);

			break;
		}
		default: {
			console.error('Unknown template');
		}
	}
});
