import { Signal } from 'signal-polyfill';

// State
const count = new Signal.State(0);

// Computed
const double = new Signal.Computed(() => {
  console.log("double 再計算");
  return count.get() * 2;
});

// 手動effect（polyfillにはeffectがないので自作）
function effect(fn) {
  // effectの代わりの低レベルAPI
  const watcher = new Signal.subtle.Watcher(async () => {
    await 0; // 非同期境界
    fn();
    watcher.watch(); // 監視対象はそのままで、次の変更通知を受けられるように通知状態だけをリセット
  });

  fn();

  // doubleを監視対象として登録
  watcher.watch(double);
}

// DOMの代わりにconsole
effect(() => {
  console.log("effect:", double.get());
});

// 全部まとめて1回しかeffect走らない
count.set(1);
count.set(2);
count.set(3);