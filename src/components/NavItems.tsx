const navItems = [
  {
    label: "Zaloguj się",
    href: "/login",
  },
  {
    label: "Zarejestruj się",
    href: "/register",
  }
]


export default function NavItems() {
  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}