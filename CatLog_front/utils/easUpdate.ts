import * as Updates from "expo-updates";

// js code update ex(eas update --profile production --message "Production release: 버그 수정 및 UI 개선")

export async function onFetchUpdateAsync() {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    // alert(`${error}`);
  }
}
