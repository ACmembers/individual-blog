import type { PioConfig } from "../types/config";

// Pio 看板娘配置
export const pioConfig: PioConfig = {
	enable: true,  // 启用看板娘
	models: ["/pio/models/NOIR/noir.model3.json"], // 默认模型路径
	position: "left", // 模型位置
	width: 280, // 默认宽度
	height: 250, // 默认高度
	mode: "draggable", // 默认为可拖拽模式
	hiddenOnMobile: true, // 默认在移动设备上隐藏
	hideAboutMenu: false, // 隐藏内置 About 菜单按钮
	dialog: {
		welcome: "欢迎来到我的博客~",
		touch: [
			"你在干嘛？",
			"别摸了啦！",
			"好痒！",
			"再摸我生气了！",
		], // 触摸提示
		home: "点这里回到首页！", // 首页提示
		skin: ["换新衣服了，好看吗？", "新衣服真好看~"], // 换装提示
		close: "下次再见啦~", // 关闭提示
		link: "https://github.com/ACmembers/individual-blog", // 关于链接
	},
};
