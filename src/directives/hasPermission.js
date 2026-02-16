// 例: 権限チェック用カスタムディレクティブ)
import { useAuthStore } from '@/stores/auth';

export const hasPermission = {
  // ディレクティブが要素にバインドされたとき、または更新されたとき
  mounted(el, binding) {
    const authStore = useAuthStore(); // ストアにアクセス
    const requiredPermission = binding.value; // ディレクティブの値（例: 'delete_user'）

    // ユーザーが指定された権限を持っているかチェック
    // checkUserPermission は Auth ストアのアクションまたはゲッターとして定義
    // 例: if (!authStore.checkUserPermission(requiredPermission)) {
    //    el.style.display = 'none'; // 要素を非表示にする
    // }

    // または、ユーザーのロールに基づいてチェック
    const requiredRole = binding.arg; // 例: v-has-permission:admin="permissionName" の 'admin'
    if (requiredRole && authStore.user?.role !== requiredRole) {
         el.style.display = 'none';
    } else if (requiredPermission && !authStore.user?.permissions?.includes(requiredPermission)) {
         el.style.display = 'none';
    }


  },
  // 必要に応じて updated フックも定義して、権限が変わったときに表示を更新
  // updated(el, binding) { ... 同様のロジック ... }
};

// 使用例
//import { createApp } from 'vue';
//import App from './App.vue';
// ... 他のインポート ...
//import { hasPermission } from '@/directives/hasPermission'; // カスタムディレクティブをインポート

//const app = createApp(App);
// ... use() ...

// カスタムディレクティブを登録
//app.directive('has-permission', hasPermission);

// ... mount() ...
//<template>
//  <div>
//    <button v-has-permission="'edit_item'">アイテムを編集</button>
//    <button v-has-permission:admin="'manage_users'">ユーザー管理</button> </div>
//</template>

