import type { ProfileConfig } from "../types/config";

export const profileConfig: ProfileConfig = {
	avatar: "/assets/images/avatar.jpg",
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
		{
			name: "Bilibili",
			icon: "fa7-brands:bilibili",
			url: "https://space.bilibili.com/1147662816",
		},
		{
			name: "Gitee",
			icon: "simple-icons:gitee",
			url: "https://gitee.com/acmember",
		},
		{
			name: "AtCoder",
			icon: "material-symbols:code",
			url: "https://atcoder.jp/users/ACmember",
		},
	],
};
