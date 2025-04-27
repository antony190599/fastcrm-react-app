import { HomeIcon, UsersIcon, BuildingOffice2Icon, ChatBubbleLeftRightIcon, ClockIcon } from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Contactos', href: '/contacts', icon: UsersIcon },
    { name: 'Empresas', href: '/companies', icon: BuildingOffice2Icon },
    { name: 'Plantillas', href: '/templates', icon: ChatBubbleLeftRightIcon },
    { name: 'Historial', href: '/contact-logs', icon: ClockIcon },
  ];

  return (
    <div>
      {/* Sidebar content */}
    </div>
  );
};

export default Sidebar;