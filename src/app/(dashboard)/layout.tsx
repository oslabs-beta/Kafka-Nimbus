

export default function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <body>
            {/* <SideBar /> */}
            {children}
      </body>
  );
}

