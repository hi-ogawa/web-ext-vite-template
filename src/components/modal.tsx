import {
  FloatingPortal,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
} from "@floating-ui/react-dom-interactions";
import { Transition } from "@headlessui/react";
import { tinyassert } from "@hiogawa/utils";
import type React from "react";
import { RemoveScroll } from "react-remove-scroll";

export function Modal(props: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { floating, context } = useFloating({
    open: props.open,
    onOpenChange: (open) => {
      tinyassert(!open); // should get only `open = false` via `useDismiss`
      props.onClose();
    },
  });
  const { getFloatingProps } = useInteractions([useDismiss(context)]);
  const id = useId();

  return (
    <FloatingPortal id={id}>
      <Transition appear show={props.open} className="z-100">
        {/* backdrop */}
        <Transition.Child
          className="transition duration-300 fixed inset-0 bg-black"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        />
        {/* content */}
        <RemoveScroll className="fixed inset-0 overflow-hidden flex justify-center items-center">
          <Transition.Child
            // TODO: override-able width/height
            className="transition duration-300 transform w-[90%] max-w-[700px] h-[90%] max-h-[500px] bg-colorBgContainer shadow-lg"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              {...getFloatingProps({
                ref: floating,
                className: "w-full h-full",
              })}
            >
              {props.children}
            </div>
          </Transition.Child>
        </RemoveScroll>
      </Transition>
    </FloatingPortal>
  );
}
