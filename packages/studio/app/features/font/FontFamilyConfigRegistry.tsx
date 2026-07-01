import type { FontFamilyConfigVariantProps } from "./FontFamilyConfigVariant";
import { FontFamilyConfigVariant } from "./FontFamilyConfigVariant";
import type { ConfigurationStateFontManualFamilyValues } from "./font.utils";

export function FontFamilyConfigRegistry<
  T extends ConfigurationStateFontManualFamilyValues
>({
  tokenName,
  familyName,
  id,
  source,
  onAction,
  meta,
}: T & FontFamilyConfigVariantProps) {
  // const handleChangeFontFamily = useCallback<
  //   ChangeEventHandler<HTMLInputElement>
  // >(
  //   ({ currentTarget: { value } }) => {
  //     onAction({ action: "changeFontFamily", id, fontFamily: value });
  //   },
  //   [id, onAction]
  // );

  return (
    <FontFamilyConfigVariant
      id={id}
      tokenName={tokenName}
      familyName={familyName}
      source={source}
      meta={meta}
      onAction={onAction}
    >
      registry stuff
    </FontFamilyConfigVariant>
  );
}
