import { getLocalStorageCRUD } from "./getLocalStorage";
import { sidebarMenuItems } from "./pathList";

export const navigateHelp = () => {
  const { admin_crud } = getLocalStorageCRUD();

  const currentPath = window.location.pathname;

  // Find the matching sidebar item
  const matchedItem = sidebarMenuItems.find(
    (item) => item.path === currentPath
  );

  console.log("matchedItem => ", matchedItem);

  if (!matchedItem) {
    console.warn("No matching sidebar item for current path:", currentPath);
    return;
  }

  const entityCode = matchedItem.entity_code;

  const matchedEntityItem = admin_crud.find(
    (item) => item.entity_code === entityCode
  );

  console.log("matchedEntityItem => ", matchedEntityItem);

  const helpUrl = matchedEntityItem?.entity_help;

  window.open(helpUrl, "_blank");
};
