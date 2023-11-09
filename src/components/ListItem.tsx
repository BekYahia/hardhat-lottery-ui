import { Info } from "@web3uikit/icons";

interface ListItem {
    name: string;
    value: string | number;
}
export default function ListItem({name, value}: ListItem) {
  return (
    <li className="flex items-center text-lg">
      <Info className="mr-1 text-gray-600" />
      <strong className="text-gray-700 capitalize mr-2">{name}:</strong>
      <span className="text-gray-600">{value ?? "-"}</span>
    </li>
  );
}
