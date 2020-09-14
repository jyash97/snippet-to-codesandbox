import { getSandboxURL } from './utils';

chrome.runtime.onInstalled.addListener(function runtimeListener() {
	chrome.contextMenus.create({
		title: 'Open in CodeSandbox',
		id: 'parent',
		contexts: ['selection'],
	});

	chrome.contextMenus.create({
		title: 'React',
		parentId: 'parent',
		id: 'react',
		contexts: ['selection'],
	});

	chrome.contextMenus.create({
		title: 'Vanilla',
		parentId: 'parent',
		id: 'vanilla',
		contexts: ['selection'],
	});
});

chrome.contextMenus.onClicked.addListener(function clickListener(clickData) {
	switch (clickData.menuItemId) {
		case 'react': {
			getSandboxURL({
				template: 'react',
				content: clickData.selectionText,
			})
				.then((r) => r.json())
				.then((data) => {
					chrome.tabs.create({
						url: `https://codesandbox.io/s/${data.sandbox_id}`,
					});
				});
			break;
		}
		default: {
			console.log('Nothing');
		}
	}
});
