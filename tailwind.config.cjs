/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{vue,html}"
	],
	prefix: 'tw-',
	theme: {
		colors: {
			"p-10": 'rgb(var(--primary-10))',
			"p-9": 'rgb(var(--primary-9))',
			"p-8": 'rgb(var(--primary-8))',
			// 点击（click）
			"p-7": 'rgb(var(--primary-7))',
			// 常规
			"p-6": 'rgb(var(--primary-6))',
			// 悬浮
			"p-5": 'rgb(var(--primary-5))',
			// 特殊场景
			"p-4": 'rgb(var(--primary-4))',
			//一般禁用
			"p-3": 'rgb(var(--primary-3))',
			//文字禁用
			"p-2": 'rgb(var(--primary-2))',
			//浅色/白底悬浮
			"cb-1": 'var(--color-border-1)',
			"cb-2": 'var(--color-border-2)',
			"cb-3": 'var(--color-border-3)',
			"cb-4": 'var(--color-border-4)',
			// 填充颜色
			"cf-1": 'var(--color-fill-1)',
			"cf-2": 'var(--color-fill-2)',
			"cf-3": 'var(--color-fill-3)',
			"cf-4": 'var(--color-fill-4)',
			// 背景颜色
			"cbg-1": 'var(--color-bg-1)',
			"cbg-2": 'var(--color-bg-2)',
			"cbg-3": 'var(--color-bg-3)',
			"cbg-4": 'var(--color-bg-4)',
			"cbg-5": 'var(--color-bg-5)',
			// 透明填充颜色
			"fill-transparent-1": 'var(--color-bg-opacity-1)',
			"fill-transparent-2": 'var(--color-bg-opacity-2)',
			"fill-transparent-3": 'var(--color-bg-opacity-3)',
			"fill-transparent-4": 'var(--color-bg-opacity-4)',
			"fill-transparent-5": 'var(--color-bg-opacity-5)',
		},
		textColor: {
			'c-1': 'var(--color-text-1)',
			'c-2': 'var(--color-text-2)',
			'c-3': 'var(--color-text-3)',
			'c-4': 'var(--color-text-4)',
			"p-10": 'rgb(var(--primary-10))',
			"p-9": 'rgb(var(--primary-9))',
			"p-8": 'rgb(var(--primary-8))',
			// 点击（click）
			"p-7": 'rgb(var(--primary-7))',
			// 常规
			"p-6": 'rgb(var(--primary-6))',
			// 悬浮
			"p-5": 'rgb(var(--primary-5))',
			// 特殊场景
			"p-4": 'rgb(var(--primary-4))',
			//一般禁用
			"p-3": 'rgb(var(--primary-3))',
			//文字禁用
			"p-2": 'rgb(var(--primary-2))',
			//浅色/白底悬浮
			"p-1": 'rgb(var(--primary-1))',
		},
		fontSize: {
			'body-1': '12px',
			'body-2': '13px',
			'body-3': '14px',
			'title-1': '16px',
			'title-2': '18px',
			'title-3': '22px',
			'title-4': '28px',
			'display-1': '30px',
			'display-2': '42px',
			'display-3': '48px',
			'display-4': '56px'
		},
		screens: {
			'sm': '576px',  // 大屏手机,隐藏侧边改弹出
			// => @media (min-width: 640px) { ... }
			'md': '768px',  // 平板 侧边+手机布局
			// => @media (min-width: 768px) { ... }
			'lg': '992px',  // 收起侧边+电脑布局
			// => @media (min-width: 1024px) { ... }
			'xl': '1200px',  // 电脑布局
			// => @media (min-width: 1280px) { ... }
			'2xl': '1600px',
			// => @media (min-width: 1536px) { ... }
		}, spacing: {
			px: '1px',
			0: '0px',
			0.5: '2px',
			1: '4px',
			1.5: '6px',
			2: '8px',
			2.5: '10px',
			3: '12px',
			3.5: '14px',
			4: '16px',
			5: '20px',
			6: '24px',
			7: '28px',
			8: '32px',
			9: '36px',
			10: '40px',
			11: '44px',
			12: '48px',
			14: '56px',
			16: '64px',
			20: '80px',
			24: '96px',
			28: '112px',
			32: '128px',
			36: '144px',
			40: '160px',
			44: '176px',
			48: '192px',
			52: '208px',
			56: '224px',
			60: '240px',
			64: '256px',
			72: '288px',
			80: '320px',
			96: '384px'
		},
	},
	plugins: [],
	corePlugins: {
		container: false,
		preflight: false,
	}
}
