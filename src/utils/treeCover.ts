import { cloneDeep } from "es-toolkit";
import { get } from "es-toolkit/compat";
interface CoverOptions {
    fieldsPath?: string | number | Array<string | number>;
    sequential?: boolean;
}

function arrSort(arr: any[], options?: CoverOptions) {
    const { fieldsPath = "order", sequential = true } = options || {};
     arr.sort((a: any, b: any) => {
         let aSort = get(a, fieldsPath);
        let bSort = get(b, fieldsPath);

        return sequential ? aSort - bSort : bSort - aSort;
    });
 }

 
// 将扁平化数据转换为树形结构
export function flat2treeByArr(flats: any[], option?: CoverOptions) {
    let _flats = cloneDeep(flats);
    const tree: any[] = [];
    let getChildren = (children: any[], pid: number | null) => {
        _flats.forEach((item: any) => {
            if (item.pid === pid) {
                let son = { ...item, children: [] };
                children.push(son);
                getChildren(son.children, son.id);
            }
        });
        arrSort(children, option);
    };
    getChildren(tree, null);
    return tree;
}

export function flat2treeByMap(flats: any[], options?: CoverOptions) {
    let _flats = cloneDeep(flats);
    const idMap = new Map();
    const tree: any[] = [];
    // 先将所有节点根据节点 id存入Map中,并添加children属性
    _flats.forEach((item: any) => {
        idMap.set(item.id, { ...item, children: [] });
    });
    for (const node of idMap.values()) {
        // 如果节点的父节点不存在,则为根节点,直接添加到树中
        if (node.pid === null) {
            tree.push(node);
            arrSort(tree, options);
        } else {
            // 获取父节点
            const parent = idMap.get(node.pid);
            if (parent) {
                // 将当前子节点加入到父节点 children 中
                parent.children.push(node);
                // 排序
                arrSort(parent.children, options);
            }
        }
    }
    return tree;
}

export function flatToTree2ByFilter(flats: any) {
    let _flats = cloneDeep(flats);

    return _flats.filter((parent: any) => {
        let son = _flats.filter((child: any) => {
            return parent.id === child.pid;
        });
        son.length > 0 ? (parent.children = son) : (parent.children = []);
        return parent.pid === null;
    });
}

// 将树形结构转换为扁平化数据,并拼接父节点的路径
// 适用于树形结构中有children属性的情况
export function tree2flat(tree: any[], options?: CoverOptions) {
    let _tree = cloneDeep(tree);
    let flats: any[] = [];
    function coverChild(children: any[], parrentPath:string) {
        arrSort(children, options);
        children.forEach((child) => {
            const { children, ...item } = child;
            if (item.path) item.path = `${parrentPath}/${item.path}`;
            flats.push(item);
            if (children && children.length >= 1) {
                coverChild(children, item.path);
            }
        });
    }
    coverChild(_tree,"");
    return flats;
}
// 扁平结构排序
export function flatOrder(flats: any[], options?: CoverOptions) {
    let tree = flat2treeByMap(flats, options);
    return tree2flat(tree, options);
}
