import Link from "next/link"

export default function Footer() {

  const footerLinks = [
    {
      title: 'Category',
      links: [
        {
          label: 'Electronics',
          href: '/categories/electronics',
        },
        {
          label: 'Home Appliances',
          href: '/categories/home-appliances',
        },
        {
          label: 'Fashion',
          href: '/categories/fashion',
        },
      ]
    },
    {
      title: 'Contacts',
      links: [
        {
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/vaibhavjaiswar/',
        },
        {
          label: 'GitHub',
          href: 'https://github.com/vaibhavjaiswar/',
        },
      ]
    },
  ]

  return (
    <footer className="global-responsive-px pt-4 pb-2 bg-neutral-900 text-neutral-100">
      <div className="flex flex-col md:flex-row justify-between items-start gap-2">
        <div className="max-w-96">
          <h2 className="mb-2 text-xl font-bold">SuperKart 🛒</h2>
          <p className="text-xs">This is personal project website for learning purpose only. Porro provident, suscipit minima error nulla exercitationem quia tempore dignissimos illo cupiditate. At, nisi facere magni voluptas dolores nam dolore nemo quae.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          {
            footerLinks.map(group => (
              <div key={group.title} className="min-w-32">
                <h4 className="text-lg">{group.title}</h4>
                <ul className="flex flex-col gap-1 items-start">
                  {
                    group.links.map(link => (
                      <Link key={link.label} href={link.href} target="_blank" className="text-sm hover:underline">
                        <li>{link.label}</li>
                      </Link>
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </div>
      </div>
      <p className="mt-3 md:mt-2 text-sm text-center">&copy; Design & developed by Vaibhav Jaiswar</p>
    </footer>
  )
}