import {
  ContextModalButton,
  ContextModalButtonProps,
} from "../../components/ContextModalButton/ContextModalButton";
import { useGlobalContext } from "../../data-access/global-context.data-access";

export type GlobalContextModalButtonProps = Omit<
  ContextModalButtonProps,
  "context"
>;

export const GlobalContext = ({
  className,
  ...props
}: GlobalContextModalButtonProps) => {
  const { data } = useGlobalContext();

  return data && data?.length > 0 ? (
    <ContextModalButton
      context={data ?? []}
      className={className}
      title="Global Context"
      {...props}
    >
      Manage {data?.length ?? ""} Item(s)
    </ContextModalButton>
  ) : null;
};
