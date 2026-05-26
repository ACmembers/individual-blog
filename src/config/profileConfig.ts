import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp",
	name: "个人博客",
	bio: "记录技术、生活和思考。",
	typewriter: {
		enable: false,
		speed: 80,
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/ACmembers",
		},
	],
};
