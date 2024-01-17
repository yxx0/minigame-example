/**
 * Home
 * @author yxx0
 */

import { exampleConfig } from './exampleConfig';

const { ccclass } = cc._decorator;

@ccclass
export default class Home extends cc.Component {
	/** 容器 */
	container: cc.Node = null;
	/** 导航栏 */
	nav: cc.Node = null;
	/** 导航栏切换按钮 */
	btnSwitchNav: cc.Node = null;

	/** 导航栏显示状态 */
	_navActive: boolean = false;
	/** 导航栏初始X值 */
	_navStartX: number = 0;
	/** 当前配置信息 */
	_curConfig: { name: string, des: string, title: string } = null;

	protected onLoad(): void {
		this.initNodes();
		this.initEvents();
		this.initData();
		this.initNav();
	}

	/**
	 * 初始化节点
	 */
	private initNodes(): void {
		this.container = cc.find('Container', this.node);
		this.nav = cc.find('Nav', this.node);
		this.btnSwitchNav = cc.find('Switch', this.nav);
	}

	/**
	 * 初始化事件
	 */
	private initEvents(): void {
		this.btnSwitchNav.on(cc.Node.EventType.TOUCH_END, this.switchNavActive, this);
	}

	/**
	 * 初始化数据
	 */
	private initData(): void {
		this._navStartX = this.nav.x;
	}

	/**
	 * 初始化游戏列表
	 */
	private initNav(): void {
		const list = cc.find('View/List', this.nav);
		const item = list.children[0];

		exampleConfig.forEach((config: { name: string, des: string, title: string }) => {
			const node = cc.instantiate(item);
			list.addChild(node);

			node.getComponent(cc.Label).string = `${config.name}`;
			node.on(cc.Node.EventType.TOUCH_END, () => { this.jumpExample(config); }, this);
			node.active = true;
		});
	}

	/**
	 * 切换游戏列表状态
	 */
	private switchNavActive(): void {
		this._navActive = !this._navActive;

		const lbSwitchNavStatus = this.btnSwitchNav.getChildByName('Status').getComponent(cc.Label);
		lbSwitchNavStatus.string = this._navActive ? '>>' : '<<';

		const x = this._navActive ? this._navStartX - 300 : this._navStartX;
		const dur = .3;

		this.nav.stopAllActions();
		cc.tween(this.nav)
			.call(() => {
				if (this._navActive) {
					this.nav.getChildByName('View').active = true;
				}
			})
			.to(dur, { x })
			.call(() => {
				if (!this._navActive) {
					this.nav.getChildByName('View').active = false;
				}
			})
			.start();
	}
	/**
	 *  进入某一个例子
	 */
	private jumpExample(config: { name: string, des: string, title: string }): void {
		this.container.destroyAllChildren();

		this._curConfig = config;

		cc.assetManager.loadBundle('example', (err, bundle) => {
			if (err) return;
			bundle.load(`${config.name}/prefab/${config.name}`, (err, prefab: cc.Prefab) => {
				if (err || this._curConfig.name != config.name) return;
				this.container.destroyAllChildren();
				this.container.addChild(cc.instantiate(prefab));
			});
		});


	}
}
