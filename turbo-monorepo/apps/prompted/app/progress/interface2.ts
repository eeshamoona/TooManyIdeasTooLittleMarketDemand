import * as Ai from "react-icons/ai"; // Ant Design Icons
import * as Bi from "react-icons/bi"; // Boxicons
import * as Bs from "react-icons/bs";
import * as Cg from "react-icons/cg"; // CSS.gg
import * as Fa from "react-icons/fa";
import * as Fa6 from "react-icons/fa6";
import * as Fi from "react-icons/fi"; // Feather
import * as Gi from "react-icons/gi";
import * as Go from "react-icons/go";
import * as Hi from "react-icons/hi";
import * as Hi2 from "react-icons/hi2"; // Heroicons 2
import * as Io from "react-icons/io";
import * as Io5 from "react-icons/io5";
import * as Lia from "react-icons/lia";
import * as Lu from "react-icons/lu";
import * as Md from "react-icons/md";
import * as Ri from "react-icons/ri"; // Remix Icons
import * as Rx from "react-icons/rx"; // Radix Icons
import * as Si from "react-icons/si"; // Simple Icons
import * as Tb from "react-icons/tb";
import * as Tfi from "react-icons/tfi";
import * as Vsc from "react-icons/vsc"; // VS Code Icons
import * as Wi from "react-icons/wi";

const iconCache: { [key: string]: any } = {};

export const getIconComponent = (iconName: string) => {
  // Check if the icon is already cached
  if (iconCache[iconName]) {
    return iconCache[iconName];
  }

  // Special case for Io5 icons since they follow a different naming pattern
  if (iconName.startsWith("Io") && iconName.includes("Outline")) {
    iconCache[iconName] = Io5[iconName];
    return iconCache[iconName];
  }

  // Special case for Heroicons v2
  if (iconName.startsWith("Hi") && iconName.includes("2")) {
    iconCache[iconName] = Hi2[iconName];
    return iconCache[iconName];
  }

  const [prefix, ...rest] = iconName.split(/(?=[A-Z])/);

  const iconSet: { [key: string]: any } = {
    Ai,
    Bi,
    Bs,
    Cg,
    Fa,
    Fa6,
    Fi,
    Gi,
    Go,
    Hi,
    Hi2,
    Io,
    Io5,
    Lia,
    Lu,
    Md,
    Ri,
    Rx,
    Si,
    Tb,
    Tfi,
    Vsc,
    Wi,
  };

  // Check both Fa and Fa6 for Font Awesome icons
  if (prefix === "Fa") {
    iconCache[iconName] = Fa[iconName] || Fa6[iconName];
    return iconCache[iconName];
  }

  // Check both Hi and Hi2 for Heroicons
  if (prefix === "Hi") {
    iconCache[iconName] = Hi[iconName] || Hi2[iconName];
    return iconCache[iconName];
  }

  iconCache[iconName] = iconSet[prefix]?.[iconName];
  return iconCache[iconName];
};
