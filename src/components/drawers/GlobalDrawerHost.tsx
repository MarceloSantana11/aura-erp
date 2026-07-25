import React from 'react';
import { useDrawer } from '../../context/DrawerContext';
import { ClientDrawer } from './ClientDrawer';
import { AppointmentDrawer } from './AppointmentDrawer';
import { Client, Appointment } from '../../types';

interface GlobalDrawerHostProps {
  onOpenAppointmentModal: (clientId?: string, clientName?: string) => void;
  onOpenCheckoutModal?: (app?: Appointment) => void;
  onToggleFullProfileView?: (client: Client) => void;
}

export const GlobalDrawerHost: React.FC<GlobalDrawerHostProps> = ({
  onOpenAppointmentModal,
  onOpenCheckoutModal,
  onToggleFullProfileView,
}) => {
  const { isOpen, activeItem, closeDrawer } = useDrawer();

  if (!isOpen || !activeItem) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-150"
      />

      {/* Drawer Container (Desktop slide-over, Mobile full-screen) */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-xl md:max-w-2xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 h-[100dvh]">
        {activeItem.type === 'client' && (
          <ClientDrawer
            client={activeItem.data as Client}
            onOpenAppointmentModal={onOpenAppointmentModal}
            onToggleFullProfileView={
              onToggleFullProfileView
                ? () => onToggleFullProfileView(activeItem.data as Client)
                : undefined
            }
          />
        )}

        {activeItem.type === 'appointment' && (
          <AppointmentDrawer
            appointment={activeItem.data as Appointment}
            onOpenCheckout={(app) => {
              closeDrawer();
              if (onOpenCheckoutModal) onOpenCheckoutModal(app);
            }}
          />
        )}
      </div>
    </>
  );
};
