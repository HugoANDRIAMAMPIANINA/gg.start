"use client";

type ModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ open, title, children }: ModalProps) {
  return (
    <dialog className="modal" open={open}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </dialog>
  );
}
