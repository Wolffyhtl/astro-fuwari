/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a Codeberg Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The Codeberg repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Codeberg Card component.
 */
export function CodebergCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("codeberg" directive must be leaf type "::codeberg{repo="owner/repo"}")',
		]);

	if (!properties.repo || !properties.repo.includes("/"))
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attributte must be in the format "owner/repo")',
		);

	const repo = properties.repo;
	const cardUuid = `GC${Math.random().toString(36).slice(-6)}`; // Collisions are not important

	const nAvatar = h(`div#${cardUuid}-avatar`, { class: "gc-avatar" });
	const nLanguage = h(
		`span#${cardUuid}-language`,
		{ class: "gc-language" },
		"Waiting...",
	);

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h("div", { class: "gc-user" }, repo.split("/")[0]),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repo.split("/")[1]),
		]),
		h("div", { class: "codeberg-logo" }),
	]);

	const nDescription = h(
		`div#${cardUuid}-description`,
		{ class: "gc-description" },
		"Waiting for codeberg.org/api/v1...",
	);

	const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, "00K");
	const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, "0K");
	const nLicense = h(`div#${cardUuid}-license`, { class: "gc-license" }, "0K");

	const nScript = h(
		`script#${cardUuid}-script`,
		{ type: "text/javascript", defer: true },
		`
      fetch('https://codeberg.org/api/v1/repos/${repo}', { referrerPolicy: "no-referrer" }).then(response => response.json()).then(data => {
        document.getElementById('${cardUuid}-description').innerText = data.description?.replace(/:[a-zA-Z0-9_]+:/g, '') || "Description not set";
        document.getElementById('${cardUuid}-language').innerText = data.language;
        document.getElementById('${cardUuid}-forks').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.forks_count).replaceAll("\u202f", '');
        document.getElementById('${cardUuid}-stars').innerText = Intl.NumberFormat('en-us', { notation: "compact", maximumFractionDigits: 1 }).format(data.stars_count).replaceAll("\u202f", '');
        const avatarEl = document.getElementById('${cardUuid}-avatar');
        avatarEl.style.backgroundImage = 'url(' + data.owner.avatar_url + ')';
        avatarEl.style.backgroundColor = 'transparent';
        // Codeberg API does not provide license information, hiding the license field
        document.getElementById('${cardUuid}-license').style.display = 'none';
        document.getElementById('${cardUuid}-card').classList.remove("fetch-waiting");
        console.log("[CODEBERG-CARD] Loaded card for ${repo} | ${cardUuid}.")
      }).catch(err => {
        const c = document.getElementById('${cardUuid}-card');
        c?.classList.add("fetch-error");
        console.warn("[CODEBERG-CARD] (Error) Loading card for ${repo} | ${cardUuid}.")
      })
    `,
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: "card-codeberg fetch-waiting no-styling",
			href: `https://codeberg.org/${repo}`,
			target: "_blank",
			repo,
		},
		[
			nTitle,
			nDescription,
			h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
			nScript,
		],
	);
}
