// 必須
export const requiredMessage = (value) => `${value}は必須項目です`;
// メールアドレス
export const emailMessage = () => `メールアドレスの形式が正しくありません`;
// 最低文字数
export const minLengthMessage = (value, length) =>
  `${value}は${length}文字以上必要です`;

// 最低値
export const minValMessage = (value, minVal) =>
  `${value}は${minVal}以上必要です`;

// 数値の範囲
export const rangeMessage = (value, minVal, maxVal) =>
  `${value}は${minVal}～${maxVal}を入力可能です`;

// サンプル
//const rules = {
//  email: {
//    required: helpers.withMessage(requiredMessage("メールアドレス"), required),
//    email: helpers.withMessage(emailMessage, email),
//  },
//  password: {
//    required: helpers.withMessage(requiredMessage("パスワード"), required),
//    minLengthValue: helpers.withMessage(
//      minLengthMessage("パスワード", 8),
//      minLength(8)
//    ),
//  },
//};
