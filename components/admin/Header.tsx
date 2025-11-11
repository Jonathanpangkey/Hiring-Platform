// src/components/admin/Header.tsx
"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {ChevronRight} from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: Breadcrumb[];
}

export default function Header({breadcrumbs}: HeaderProps) {
  const router = useRouter();

  useEffect(() => {
    const headerContent = document.getElementById("header-content");
    if (!headerContent) return;

    // Clear existing content
    headerContent.innerHTML = "";

    const container = document.createElement("div");

    // Add breadcrumbs if exists
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbContainer = document.createElement("div");
      breadcrumbContainer.className = "flex items-center gap-2 text-sm mb-1";

      breadcrumbs.forEach((crumb, index) => {
        // Breadcrumb item
        const crumbEl = document.createElement(crumb.href ? "button" : "span");

        if (crumb.href) {
          crumbEl.className = "text-neutral-600 text-lg font-semibold hover:text-neutral-900 transition-colors";
          crumbEl.textContent = crumb.label;
          crumbEl.onclick = () => router.push(crumb.href!);
        } else {
          crumbEl.className = "text-neutral-900 text-lg font-bold ";
          crumbEl.textContent = crumb.label;
        }

        breadcrumbContainer.appendChild(crumbEl);

        if (index < breadcrumbs.length - 1) {
          const separator = document.createElement("span");
          separator.className = "text-neutral-400";
          separator.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>`;
          breadcrumbContainer.appendChild(separator);
        }
      });

      container.appendChild(breadcrumbContainer);
    }

    headerContent.appendChild(container);

    return () => {
      if (headerContent) {
        headerContent.innerHTML = "";
      }
    };
  }, [breadcrumbs, router]);

  return null;
}
