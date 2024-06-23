//保持しているブキリストに対してフィルタリングを行うクラス
// フィルタリングを行う項目は以下の通り
// 1. メインウェポンid
// 2. サブウェポンid
// 3. スペシャルウェポンid
// 4. メインウェポン種別id
// フィルタリングを行う際には、上記の項目に対して完全一致でフィルタリングを行う
// 例えば、メインウェポンidが1のブキのみを抽出する場合、メインウェポンidに1を指定してフィルタリングを行う
// また、フィルタリングを行う際には、フィルタリングを行う項目を指定してフィルタリングを行う

class BukiFilter {
    #bukiList;
    #filteredList;
    #mainWeaponIds;
    #subWeaponIds;
    #specialWeaponIds;
    #mainWeaponTypeIds;
    constructor(bukiList) {
        this.#bukiList = bukiList;
        this.#filteredList = this.bukiList.concat();
        this.#mainWeaponIds = [];
        this.#subWeaponIds = [];
        this.#specialWeaponIds = [];
        this.#mainWeaponTypeIds = [];
    }

    //フィルタリングを行う
    filter() {
        this.resetFilter();
        this.filterByMainWeaponId();
        this.filterBySubWeaponId();
        this.filterBySpecialWeaponId();
        this.filterByMainWeaponTypeId();
        return this.filteredList;
    }

    //メインウェポンidによるフィルタリング

    resetFilter() {
        this.#filteredList = this.bukiList.concat();
    }
    get bukiList() {
        return this.#bukiList;
    }
    get filteredList() {
        return this.#filteredList;
    }
    set mainWeaponIds(mainWeaponIds) {
        this.#mainWeaponIds = mainWeaponIds.filter(ids => ids !== "").map(ids => parseInt(ids));
    }
    set subWeaponIds(subWeaponIds) {
        this.#subWeaponIds = subWeaponIds.filter(ids => ids !== "").map(ids => parseInt(ids));
    }
    set specialWeaponIds(specialWeaponIds) {
        this.#specialWeaponIds = specialWeaponIds.filter(ids => ids !== "").map(ids => parseInt(ids));
    }
    set mainWeaponTypeIds(mainWeaponTypeIds) {
        this.#mainWeaponTypeIds = mainWeaponTypeIds.filter(ids => ids !== "").map(ids => parseInt(ids));
    }
    filterByMainWeaponId() {
        if (this.#mainWeaponIds.length === 0) {
            return;
        }
        this.#filteredList = this.#filteredList.filter(buki => this.#mainWeaponIds.includes(buki.mainWeaponId));
    }
    filterBySubWeaponId() {
        if (this.#subWeaponIds.length === 0) {
            return;
        }
        this.#filteredList = this.#filteredList.filter(buki => this.#subWeaponIds.includes(buki.subWeaponId));
    }
    filterBySpecialWeaponId() {
        if (this.#specialWeaponIds.length === 0) {
            return;
        }
        this.#filteredList = this.#filteredList.filter(buki => this.#specialWeaponIds.includes(buki.specialWeaponId));
    }
    filterByMainWeaponTypeId() {
        if (this.#mainWeaponTypeIds.length === 0) {
            return;
        }
        this.#filteredList = this.#filteredList.filter(buki => this.#mainWeaponTypeIds.includes(buki.mainWeaponTypeId));
    }

}
export default BukiFilter;