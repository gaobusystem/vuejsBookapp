import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart',  {
    state:() =>({
        items: [], // itemId,name,price,quantity
    }),
    getters: {
        cartItemCount: (state)=> state.items.reduce((count,item)=>count + item.quantity, 0), // カート内の合計商品数
        cartTotal: (state)=> state.items.reduce((total,item)=>total + item.price * item.quantity, 0),//カート合計金額
    },
    actions: {
        addItem(item){ // {itemId,name,price}
            const existingItem = this.items.find(i => i.itemId === item.itemId);
            if(existingItem){
                existingItem.quantity++; // 既存アイテムの数量を増やす
            }else{
                this.items.push({...item, quantity: 1}); //新しいアイテムを追加
            }
        },
        removeItem(itemId){
            this.items = this.items.filter(item => item.itemId!==itemId); // 指定IDのアイテムを削除
        },
        updateItemQuantity(itemId, quantity){
            const item = this.items.find(i => i.itemId === itemId);
            if(item){
                if(quantity > 0){
                    item.quantity = quantity;
                }else{
                    this.removeItem(itemId); //0以下なら削除
                }
            }
        },
        async saveCart(){

        },
        async loadCart(){

        },
    },
});
