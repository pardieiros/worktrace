export const resources = {
  en: {
    translation: {
      common: {
        appName: "Worktrace",
        roles: {
          admin: "Administrator",
          client: "Client",
          manager: "Manager",
          member: "Member"
        },
        status: {
          active: "Active",
          inactive: "Inactive"
        },
        actions: {
          close: "Close",
          cancel: "Cancel",
          remove: "Remove"
        },
        loading: "Loading..."
      },
      header: {
        fallbackClientName: "Worktrace Client",
        openNavigation: "Open navigation",
        languageLabel: "Language",
        languages: {
          en: "English",
          es: "Spanish",
          fr: "French",
          pt: "Portuguese"
        },
        logout: "Sign out"
      },
      theme: {
        toggle: "Toggle theme"
      },
      sidebar: {
        iconAlt: "Worktrace icon",
        tagline: "Time and transparency",
        links: {
          dashboard: "Dashboard",
          clients: "Clients",
          projects: "Projects",
          assignments: "Assignments",
          timeEntries: "Time entries",
          reports: "Reports",
          settings: "Settings"
        },
        supportLabel: "Support:",
        supportEmail: "support@worktrace.app",
        accessibilityNote: "Updated to WCAG AA and HttpOnly cookies."
      },
      login: {
        title: "Sign in to the platform",
        subtitle: "Track time and transparency from a single dashboard.",
        formAriaLabel: "Login form",
        fields: {
          email: {
            label: "Email",
            placeholder: "admin@worktrace.demo"
          },
          password: {
            label: "Password",
            placeholder: "••••••••"
          }
        },
        errors: {
          emailRequired: "Email is required.",
          passwordRequired: "Password is required."
        },
        actions: {
          authenticating: "Signing in...",
          submit: "Sign in"
        },
        securityNote:
          "HttpOnly cookies and CSRF keep your access protected. Contact support@worktrace.app for support."
      },
      admin: {
        dashboard: {
          chart: {
            unknownProject: "Unknown"
          },
          cards: {
            totalHours: "Total hours",
            billable: "Billable",
            nonBillable: "Non-billable",
            billedAmount: "Total billed"
          },
          sections: {
            byProject: {
              title: "Hours per project",
              description: "Weekly comparison of billable vs non-billable hours."
            },
            activeProjects: {
              title: "Active projects",
              description: "Latest projects with recent activity.",
              badge: "Updated",
              updated: "Updated {{date}}"
            }
          }
        },
        assignments: {
          title: "Assignments",
          subtitle: "Control who can log time and with which permissions per project.",
          actions: {
            new: "New assignment",
            assigning: "Assigning...",
            save: "Save assignment"
          },
          errors: {
            createFallback: "We couldn't create the assignment. Please try again.",
            projectRequired: "Select a project to assign.",
            userRequired: "Select an admin user to assign."
          },
          table: {
            project: "Project",
            user: "User",
            role: "Role",
            status: "Status",
            empty: "No assignments recorded."
          },
          modal: {
            title: "New assignment",
            description: "Assign an administrator responsible for tracking the work on this project."
          },
          form: {
            projectLabel: "Project",
            projectPlaceholder: "Select a project",
            userLabel: "Admin user",
            userPlaceholder: "Select a user",
            roleLabel: "Role"
          }
        },
        timeEntries: {
          title: "Time tracking",
          subtitle: "Monitor time entries, control live timers, and export data you can share with clients.",
          filters: {
            projectLabel: "Project",
            projectAll: "All projects",
            fromLabel: "From",
            toLabel: "To"
          },
          actions: {
            exportCsv: "Export CSV",
            exportPdf: "Export PDF",
            startTimer: "Start timer",
            refresh: "Refresh",
            pause: "Pause",
            resume: "Resume",
            stop: "Stop"
          },
          activeTimers: {
            title: "Active timers",
            description: "Keep track of work in progress and pause or stop it whenever needed.",
            loading: "Loading timers...",
            empty: "No active timers right now.",
            elapsedLabel: "Elapsed time",
            statusLabel: "Status: {{status}}",
            statuses: {
              running: "Running",
              paused: "Paused"
            },
            startedAt: "Started at {{datetime}}"
          },
          table: {
            headers: {
              date: "Date",
              project: "Project",
              user: "User",
              task: "Task",
              duration: "Duration",
              billable: "Billable"
            },
            loading: "Loading entries...",
            billableYes: "Yes",
            billableNo: "No",
            empty: "No entries for the selected period."
          },
          details: {
            overview: "Entry overview",
            duration: "Duration logged",
            billable: "Billable?",
            timeRange: "Time range",
            timeRangeFallback: "Start/end not recorded",
            hourlyRate: "Hourly rate",
            amount: "Calculated amount",
            meta: "Meta information",
            client: "Client",
            task: "Task",
            summaryTitle: "Summary"
          },
          startModal: {
            title: "Start timer",
            description: "Choose the project and optionally add context before kicking off the session.",
            projectLabel: "Project",
            projectPlaceholder: "Select a project",
            notesLabel: "Initial notes (optional)",
            notesPlaceholder: "What will you focus on during this session?",
            submit: "Start",
            submitting: "Starting..."
          },
          stopModal: {
            title: "Stop timer",
            description: "Summarise what was delivered so the client understands the value.",
            summaryLabel: "What was done?",
            summaryPlaceholder: "Describe tasks completed, decisions taken, or blockers found.",
            taskLabel: "Task title (optional)",
            taskPlaceholder: "e.g. UX sprint KoalaClub",
            billableToggle: "Mark as billable",
            totalTime: "Total time: {{duration}}",
            submit: "Save entry",
            submitting: "Saving..."
          },
          validations: {
            projectRequired: "Select a project before starting.",
            summaryRequired: "Add a summary so the client understands the work."
          },
          errors: {
            start: "We couldn't start the timer. Please try again.",
            pause: "We couldn't pause the timer. Please try again.",
            resume: "We couldn't resume the timer. Please try again.",
            stop: "We couldn't stop the timer. Please try again."
          }
        },
        settings: {
          title: "Settings",
          subtitle: "Manage company identity, email defaults, and SMTP credentials for Worktrace.",
          lastUpdated: "Last updated {{datetime}}",
          feedback: {
            success: "Settings saved successfully.",
            error: "We couldn't save your settings. Please try again."
          },
          validations: {
            port: "Provide a valid SMTP port (positive number)."
          },
          company: {
            title: "Company identity",
            description: "Information used in reports, emails, and client-facing communication.",
            fields: {
              name: {
                label: "Trading name",
                placeholder: "Worktrace"
              },
              legalName: {
                label: "Legal name",
                placeholder: "Worktrace Ltd."
              },
              email: {
                label: "General email",
                placeholder: "info@worktrace.app"
              },
              phone: {
                label: "Phone number",
                placeholder: "+1 202 555 0101"
              },
              website: {
                label: "Website",
                placeholder: "https://worktrace.app"
              },
              vat: {
                label: "VAT / Tax ID",
                placeholder: "US99-9999999"
              },
              address: {
                label: "Address",
                placeholder: "123 Startup Way\nSuite 400\nSan Francisco, CA"
              },
              logo: {
                label: "Logo",
                alt: "Current logo",
                empty: "No logo uploaded",
                guidelines: "Accepted formats: PNG, JPG, SVG. Recommended size: 200x200px.",
                remove: "Remove logo",
                undoRemove: "Undo removal",
                removeWarning: "The logo will be removed when you save."
              }
            }
          },
          emails: {
            title: "Default emails",
            description: "Set the addresses used for notifications, support, and billing.",
            fields: {
              supportEmail: {
                label: "Support email",
                placeholder: "support@worktrace.app"
              },
              billingEmail: {
                label: "Billing email",
                placeholder: "billing@worktrace.app"
              },
              defaultSenderName: {
                label: "Sender name",
                placeholder: "Worktrace Team"
              },
              defaultSenderEmail: {
                label: "Sender email",
                placeholder: "noreply@worktrace.app"
              },
              replyToEmail: {
                label: "Reply-to email",
                placeholder: "contact@worktrace.app"
              }
            }
          },
          smtp: {
            title: "Email server (SMTP)",
            description: "Control how Worktrace sends transactional messages and notifications.",
            fields: {
              host: {
                label: "SMTP host",
                placeholder: "smtp.mailprovider.com"
              },
              port: {
                label: "Port",
                placeholder: "587"
              },
              username: {
                label: "SMTP username",
                placeholder: "apikey"
              },
              password: {
                label: "SMTP password",
                placeholder: ""
              }
            },
            passwordHintExisting: "Leave blank to keep the existing password or provide a new one to replace it.",
            passwordHintNew: "Enter the password provided by your email service.",
            toggles: {
              tls: "Use TLS (STARTTLS)",
              ssl: "Use SSL"
            },
            guidance: "Enable only one option: TLS is recommended for port 587, SSL for port 465."
          },
          form: {
            submit: "Save settings",
            submitting: "Saving..."
          }
        },
        clients: {
          title: "Clients",
          subtitle: "Manage client records with status and contacts.",
          actions: {
            add: "Add client",
            creating: "Creating...",
            save: "Save client"
          },
          errors: {
            createFallback: "We couldn't create the client. Please try again.",
            requiredFields: "Name and email are required."
          },
          list: {
            searchPlaceholder: "Search by name or email...",
            searchAria: "Client search",
            count_one: "{{count}} client visible",
            count_other: "{{count}} clients visible",
            openDetail: "View account for {{name}}"
          },
          table: {
            client: "Client",
            email: "Email",
            vat: "VAT number",
            status: "Status",
            empty: "No results for this search."
          },
          modal: {
            title: "Add new client",
            description: "Provide client details and share the temporary password."
          },
          success: {
            title: "Client created successfully.",
            passwordLabel: "Temporary password for",
            copyPassword: "Copy password",
            complete: "Finish",
            passwordReminder: "Ask the client to change the password on first access."
          },
          form: {
            nameLabel: "Name",
            namePlaceholder: "e.g. Company XPTO",
            emailLabel: "Email",
            emailPlaceholder: "client@company.com",
            vatLabel: "VAT number",
            vatPlaceholder: "Optional",
            notesLabel: "Notes",
            notesPlaceholder: "Additional information for the internal team.",
            logoLabel: "Client logo",
            fileSelected: "Selected: {{filename}}",
            fileHelp: "Accepts image formats (PNG, JPG, SVG). Max 5MB."
          },
          details: {
            title: "Client details",
            subtitle: "Review contact information and outstanding balance in one place.",
            about: {
              heading: "Client information",
              email: "Email",
              vat: "VAT number",
              noVat: "Not provided",
              notes: "Notes",
              noNotes: "No notes available.",
              status: "Status",
              createdAt: "Created",
              updatedAt: "Updated"
            },
            account: {
              heading: "Account overview",
              description: "Charges and payments registered for this client.",
              balanceLabel: "Balance due",
              chargedLabel: "Total charged",
              paidLabel: "Total paid",
              hourlyLabel: "Hourly work",
              packLabel: "Hour packs",
              historyHeading: "Account history",
              empty: "No account entries recorded yet.",
              table: {
                date: "Date",
                type: "Type",
                description: "Description",
                reference: "Reference",
                amount: "Amount",
                recordedBy: "Recorded by"
              },
              entryTypes: {
                charge: "Charge",
                payment: "Payment"
              },
              noDescription: "—",
              packsHeading: "Hour packs to bill",
              packsDescription: "These packs are being billed for this client. Payments reduce the outstanding balance automatically.",
              packHours: "{{hours}} hours included",
              packHoursFallback: "Hours not specified",
              hourlyHeading: "Hourly work to bill",
              hourlyDescription: "Billable time logged on hourly projects for this client.",
              hourlyHours: "{{hours}} hours logged",
              paymentForm: {
                title: "Record payment",
                subtitle: "Register a payment received to keep the balance up to date.",
                amountLabel: "Amount received",
                amountPlaceholder: "0.00",
                amountRequired: "Enter the payment amount.",
                dateLabel: "Payment date",
                methodLabel: "Payment method",
                methodPlaceholder: "e.g. Bank transfer, Card",
                referenceLabel: "Reference",
                referencePlaceholder: "Optional receipt or transaction ID",
                descriptionLabel: "Description",
                descriptionPlaceholder: "Optional short note visible in the history",
                notesLabel: "Internal notes",
                notesPlaceholder: "Additional context for the team (optional).",
                submit: "Save payment",
                submitting: "Saving...",
                success: "Payment recorded successfully."
              },
              errors: {
                paymentFallback: "We couldn't record the payment. Please try again.",
                loadFallback: "We couldn't load the account information. Please refresh."
              }
            }
          }
        },
        projects: {
          title: "Projects",
          subtitle: "Monitor delivery, billing, and visibility for every initiative.",
          actions: {
            newProject: "New project",
            creating: "Creating...",
            create: "Create project",
            active: "Activate",
            paused: "Pause",
            archived: "Archive"
          },
          filters: {
            statusLabel: "Status",
            statusAll: "All statuses",
            visibilityLabel: "Visibility",
            visibilityAll: "All visibilities",
            searchLabel: "Search",
            searchPlaceholder: "Search by name or client..."
          },
          stats: {
            total: "Total",
            active: "Active",
            paused: "Paused",
            archived: "Archived"
          },
          table: {
            name: "Project",
            client: "Client",
            status: "Status",
            visibility: "Visibility",
            billing: "Billing",
            hours: "Hours logged",
            updated: "Updated"
          },
          status: {
            active: "Active",
            paused: "Paused",
            archived: "Archived"
          },
          visibility: {
            client: "Client-facing",
            internal: "Internal"
          },
          billing: {
            hourly: "Hourly",
            pack: "Fixed pack"
          },
          modal: {
            title: "Create project",
            description: "Define the key information so the team and the client stay aligned.",
            fields: {
              name: "Project name",
              client: "Client",
              description: "Description",
              status: "Status",
              visibility: "Visibility",
              billingType: "Billing model",
              hourlyRate: "Hourly rate",
              currency: "Currency",
              packHours: "Pack hours",
              packValue: "Pack value"
            },
            placeholders: {
              name: "e.g. Mobile app redesign",
              client: "Select a client",
              description: "Objectives, deliverables or scope notes.",
              hourlyRate: "e.g. 60",
              packHours: "e.g. 40",
              packValue: "e.g. 2400"
            },
            helpers: {
              hourlyRate: "Set the hourly rate applied to time entries.",
              pack: "For fixed packs, inform both hours and the contracted value."
            }
          },
          validations: {
            nameRequired: "Provide a project name.",
            clientRequired: "Select a client for this project.",
            hourlyRate: "Set the hourly rate for this project.",
            packDetails: "Provide both pack hours and pack value."
          },
          errors: {
            createFallback: "We couldn't create the project. Please try again.",
            fetchFallback: "We couldn't load the projects right now."
          },
          empty: "No projects found."
        },
        reports: {
          title: "Reports",
          subtitle: "Project and user summaries with secure export options.",
          filters: {
            label: "Filter:",
            all: "All",
            billable: "Billable",
            nonBillable: "Non-billable"
          },
          cards: {
            totalHours: "Total hours",
            projects: "Projects",
            billedAmount: "Billed amount"
          },
          chart: {
            unknownProject: "Unknown",
            loading: "Loading chart..."
          },
          table: {
            project: "Project",
            client: "Client",
            hours: "Hours",
            billable: "Billable",
            nonBillable: "Non-billable",
            amount: "Amount",
            empty: "No data for the selected filter."
          }
        }
      },
      client: {
        dashboard: {
          title: "Client dashboard",
          subtitle: "Overview of your projects, hours, and billing.",
          cards: {
            assignedProjects: "Projetos atribuídos",
            totalHours: "Horas totais",
            billableHours: "Horas faturáveis",
            outstandingBalance: "Saldo em dívida"
          },
          sections: {
            distribution: "Distribuição por projeto",
            distributionHint: "Horas registadas por projeto"
          },
          chart: {
            unknownProject: "Projeto"
          },
          packs: {
            title: "Packs de horas",
            subtitle: "Track how much of each pack has been used.",
            empty: "Aucun pack d'heures disponible pour ce client.",
            noLimit: "Illimité",
            totalValue: "Valeur du pack: {{value}}",
            noHoursDefined: "Heures non définies pour ce projet."
          }
        },
        projects: {
          title: "Projetos",
          subtitle: "Lista de projetos visíveis para o cliente e o progresso de horas.",
          table: {
            name: "Nome",
            hours: "Horas",
            lastEntry: "Último registo",
            status: "Estado"
          },
          status: {
            active: "Ativo",
            paused: "Pausado",
            unknown: "Desconhecido"
          },
          lastEntryNone: "—",
          empty: "Sem projetos disponíveis."
        },
        reports: {
          title: "Relatórios",
          subtitle: "Acompanha horas registadas e faturação em todos os projetos.",
          filters: {
            monthLabel: "Mês",
            monthAll: "Todos os meses",
            billableLabel: "Faturação",
            billableAll: "Todas as entradas",
            billableOnly: "Apenas faturáveis",
            nonBillableOnly: "Apenas não faturáveis",
            searchLabel: "Pesquisa",
            searchPlaceholder: "Pesquisar por projeto...",
            reset: "Repor filtros"
          },
          summary: {
            totalHours: "Horas totais",
            billableHours: "Horas faturáveis",
            nonBillableHours: "Horas não faturáveis",
            totalAmount: "Valor total"
          },
          table: {
            project: "Projeto",
            projectUnknown: "—",
            hours: "Horas totais",
            billable: "Horas faturáveis",
            nonBillable: "Horas não faturáveis",
            amount: "Valor",
            empty: "Sem dados para os filtros selecionados."
          }
        }
      }
    }
  },
  es: {
    translation: {
      common: {
        appName: "Worktrace",
        roles: {
          admin: "Administrador",
          client: "Cliente",
          manager: "Responsable",
          member: "Miembro"
        },
        status: {
          active: "Activo",
          inactive: "Inactivo"
        },
        actions: {
          close: "Cerrar",
          cancel: "Cancelar",
          remove: "Eliminar"
        },
        loading: "Cargando..."
      },
      header: {
        fallbackClientName: "Cliente Worktrace",
        openNavigation: "Abrir navegación",
        languageLabel: "Idioma",
        languages: {
          en: "Inglés",
          es: "Español",
          fr: "Francés",
          pt: "Portugués"
        },
        logout: "Cerrar sesión"
      },
      theme: {
        toggle: "Cambiar tema"
      },
      sidebar: {
        iconAlt: "Icono de Worktrace",
        tagline: "Tiempo y transparencia",
        links: {
          dashboard: "Panel",
          clients: "Clientes",
          projects: "Proyectos",
          assignments: "Asignaciones",
          timeEntries: "Horas",
          reports: "Informes",
          settings: "Configuración"
        },
        supportLabel: "Soporte:",
        supportEmail: "support@worktrace.app",
        accessibilityNote: "Actualizado a WCAG AA y cookies HttpOnly."
      },
      login: {
        title: "Acceder a la plataforma",
        subtitle: "Controla las horas y la transparencia en un único panel.",
        formAriaLabel: "Formulario de acceso",
        fields: {
          email: {
            label: "Correo electrónico",
            placeholder: "admin@worktrace.demo"
          },
          password: {
            label: "Contraseña",
            placeholder: "••••••••"
          }
        },
        errors: {
          emailRequired: "El correo electrónico es obligatorio.",
          passwordRequired: "La contraseña es obligatoria."
        },
        actions: {
          authenticating: "Iniciando sesión...",
          submit: "Acceder"
        },
        securityNote:
          "Las cookies HttpOnly y el CSRF protegen tu acceso. Para soporte contacta con support@worktrace.app."
      },
      admin: {
        dashboard: {
          chart: {
            unknownProject: "Desconocido"
          },
          cards: {
            totalHours: "Horas totales",
            billable: "Facturables",
            nonBillable: "No facturables",
            billedAmount: "Total facturado"
          },
          sections: {
            byProject: {
              title: "Horas por proyecto",
              description: "Comparación semanal de horas facturables vs no facturables."
            },
            activeProjects: {
              title: "Proyectos activos",
              description: "Últimos proyectos con actividad reciente.",
              badge: "Actualizado",
              updated: "Actualizado {{date}}"
            }
          }
        },
        assignments: {
          title: "Asignaciones",
          subtitle: "Controla quién puede registrar tiempo y con qué permisos en cada proyecto.",
          actions: {
            new: "Nueva asignación",
            assigning: "Asignando...",
            save: "Guardar asignación"
          },
          errors: {
            createFallback: "No pudimos crear la asignación. Inténtalo de nuevo.",
            projectRequired: "Selecciona un proyecto para asignar.",
            userRequired: "Selecciona un usuario administrador para asignar."
          },
          table: {
            project: "Proyecto",
            user: "Usuario",
            role: "Rol",
            status: "Estado",
            empty: "No hay asignaciones registradas."
          },
          modal: {
            title: "Nueva asignación",
            description: "Asocia a un administrador responsable de supervisar el trabajo en este proyecto."
          },
          form: {
            projectLabel: "Proyecto",
            projectPlaceholder: "Selecciona un proyecto",
            userLabel: "Usuario administrador",
            userPlaceholder: "Selecciona un usuario",
            roleLabel: "Rol"
          }
        },
        timeEntries: {
          title: "Registro de horas",
          subtitle: "Controla las entradas de tiempo, gestiona temporizadores en vivo y exporta datos para compartir con el cliente.",
          filters: {
            projectLabel: "Proyecto",
            projectAll: "Todos los proyectos",
            fromLabel: "Desde",
            toLabel: "Hasta"
          },
          actions: {
            exportCsv: "Exportar CSV",
            exportPdf: "Exportar PDF",
            startTimer: "Iniciar temporizador",
            refresh: "Actualizar",
            pause: "Pausar",
            resume: "Reanudar",
            stop: "Detener"
          },
          activeTimers: {
            title: "Temporizadores activos",
            description: "Sigue el trabajo en progreso y pausa o termina cuando sea necesario.",
            loading: "Cargando temporizadores...",
            empty: "No hay temporizadores activos en este momento.",
            elapsedLabel: "Tiempo transcurrido",
            statusLabel: "Estado: {{status}}",
            statuses: {
              running: "En marcha",
              paused: "En pausa"
            },
            startedAt: "Iniciado el {{datetime}}"
          },
          table: {
            headers: {
              date: "Fecha",
              project: "Proyecto",
              user: "Usuario",
              task: "Tarea",
              duration: "Duración",
              billable: "Facturable"
            },
            loading: "Cargando registros...",
            billableYes: "Sí",
            billableNo: "No",
            empty: "Sin registros para el periodo seleccionado."
          },
          details: {
            overview: "Resumen de la entrada",
            duration: "Duración registrada",
            billable: "¿Facturable?",
            timeRange: "Horario",
            timeRangeFallback: "Inicio/fin no registrados",
            hourlyRate: "Tarifa horaria",
            amount: "Importe calculado",
            meta: "Información adicional",
            client: "Cliente",
            task: "Tarea",
            summaryTitle: "Resumen"
          },
          startModal: {
            title: "Iniciar temporizador",
            description: "Elige el proyecto y añade contexto si es necesario antes de iniciar la sesión.",
            projectLabel: "Proyecto",
            projectPlaceholder: "Selecciona un proyecto",
            notesLabel: "Notas iniciales (opcional)",
            notesPlaceholder: "¿En qué vas a centrarte durante esta sesión?",
            submit: "Comenzar",
            submitting: "Iniciando..."
          },
          stopModal: {
            title: "Detener temporizador",
            description: "Resume lo entregado para que el cliente entienda el valor generado.",
            summaryLabel: "¿Qué se hizo?",
            summaryPlaceholder: "Describe tareas completadas, decisiones tomadas o bloqueos encontrados.",
            taskLabel: "Título de la tarea (opcional)",
            taskPlaceholder: "Ej. Sprint UX KoalaClub",
            billableToggle: "Marcar como facturable",
            totalTime: "Tiempo total: {{duration}}",
            submit: "Guardar registro",
            submitting: "Guardando..."
          },
          validations: {
            projectRequired: "Selecciona un proyecto antes de iniciar.",
            summaryRequired: "Añade un resumen para que el cliente entienda el trabajo."
          },
          errors: {
            start: "No pudimos iniciar el temporizador. Inténtalo de nuevo.",
            pause: "No pudimos pausar el temporizador. Inténtalo de nuevo.",
            resume: "No pudimos reanudar el temporizador. Inténtalo de nuevo.",
            stop: "No pudimos detener el temporizador. Inténtalo de nuevo."
          }
        },
        settings: {
          title: "Configuración",
          subtitle: "Gestiona la identidad de la empresa, los correos predeterminados y las credenciales SMTP de Worktrace.",
          lastUpdated: "Última actualización {{datetime}}",
          feedback: {
            success: "Configuración guardada correctamente.",
            error: "No pudimos guardar la configuración. Inténtalo de nuevo."
          },
          validations: {
            port: "Indica un puerto SMTP válido (número positivo)."
          },
          company: {
            title: "Identidad de la empresa",
            description: "Datos utilizados en informes, emails y comunicación con clientes.",
            fields: {
              name: {
                label: "Nombre comercial",
                placeholder: "Worktrace"
              },
              legalName: {
                label: "Razón social",
                placeholder: "Worktrace S.L."
              },
              email: {
                label: "Email general",
                placeholder: "info@worktrace.app"
              },
              phone: {
                label: "Teléfono",
                placeholder: "+34 910 000 000"
              },
              website: {
                label: "Sitio web",
                placeholder: "https://worktrace.app"
              },
              vat: {
                label: "NIF / VAT",
                placeholder: "ES99999999A"
              },
              address: {
                label: "Dirección",
                placeholder: "Calle de las Startups, 123\n28001 Madrid"
              },
              logo: {
                label: "Logotipo",
                alt: "Logotipo actual",
                empty: "Sin logotipo",
                guidelines: "Formatos aceptados: PNG, JPG, SVG. Tamaño recomendado: 200x200px.",
                remove: "Eliminar logotipo",
                undoRemove: "Deshacer eliminación",
                removeWarning: "El logotipo se eliminará al guardar."
              }
            }
          },
          emails: {
            title: "Correos predeterminados",
            description: "Configura las direcciones utilizadas para notificaciones, soporte y facturación.",
            fields: {
              supportEmail: {
                label: "Email de soporte",
                placeholder: "support@worktrace.app"
              },
              billingEmail: {
                label: "Email de facturación",
                placeholder: "billing@worktrace.app"
              },
              defaultSenderName: {
                label: "Nombre del remitente",
                placeholder: "Equipo Worktrace"
              },
              defaultSenderEmail: {
                label: "Email del remitente",
                placeholder: "noreply@worktrace.app"
              },
              replyToEmail: {
                label: "Email de respuesta",
                placeholder: "contacto@worktrace.app"
              }
            }
          },
          smtp: {
            title: "Servidor de correo (SMTP)",
            description: "Define cómo Worktrace envía mensajes transaccionales y notificaciones.",
            fields: {
              host: {
                label: "Servidor SMTP",
                placeholder: "smtp.mailprovider.com"
              },
              port: {
                label: "Puerto",
                placeholder: "587"
              },
              username: {
                label: "Usuario SMTP",
                placeholder: "apikey"
              },
              password: {
                label: "Contraseña SMTP",
                placeholder: ""
              }
            },
            passwordHintExisting: "Déjalo en blanco para mantener la contraseña actual o introduce una nueva para reemplazarla.",
            passwordHintNew: "Introduce la contraseña proporcionada por tu servicio de correo.",
            toggles: {
              tls: "Usar TLS (STARTTLS)",
              ssl: "Usar SSL"
            },
            guidance: "Activa solo una opción: TLS se recomienda para el puerto 587, SSL para el puerto 465."
          },
          form: {
            submit: "Guardar configuración",
            submitting: "Guardando..."
          }
        },
        clients: {
          title: "Clientes",
          subtitle: "Gestiona los registros de clientes con estado y contactos.",
          actions: {
            add: "Añadir cliente",
            creating: "Creando...",
            save: "Guardar cliente"
          },
          errors: {
            createFallback: "No pudimos crear el cliente. Inténtalo de nuevo.",
            requiredFields: "El nombre y el correo electrónico son obligatorios."
          },
          list: {
            searchPlaceholder: "Buscar por nombre o correo...",
            searchAria: "Búsqueda de clientes",
            count_one: "{{count}} cliente visible",
            count_other: "{{count}} clientes visibles",
            openDetail: "Ver cuenta de {{name}}"
          },
          table: {
            client: "Cliente",
            email: "Correo electrónico",
            vat: "NIF/VAT",
            status: "Estado",
            empty: "Sin resultados para esta búsqueda."
          },
          modal: {
            title: "Añadir nuevo cliente",
            description: "Introduce los datos del cliente y comparte la contraseña temporal."
          },
          success: {
            title: "Cliente creado correctamente.",
            passwordLabel: "Contraseña temporal para",
            copyPassword: "Copiar contraseña",
            complete: "Finalizar",
            passwordReminder: "Pide al cliente que cambie la contraseña en el primer acceso."
          },
          form: {
            nameLabel: "Nombre",
            namePlaceholder: "Ej. Empresa XPTO",
            emailLabel: "Correo electrónico",
            emailPlaceholder: "cliente@empresa.com",
            vatLabel: "NIF/VAT",
            vatPlaceholder: "Opcional",
            notesLabel: "Notas",
            notesPlaceholder: "Información adicional para el equipo interno.",
            logoLabel: "Logotipo del cliente",
            fileSelected: "Seleccionado: {{filename}}",
            fileHelp: "Acepta formatos de imagen (PNG, JPG, SVG). Máx. 5 MB."
          },
          details: {
            title: "Detalles del cliente",
            subtitle: "Consulta los datos de contacto y el saldo pendiente en un único lugar.",
            about: {
              heading: "Información del cliente",
              email: "Correo electrónico",
              vat: "NIF",
              noVat: "No informado",
              notes: "Notas",
              noNotes: "Sin notas registradas.",
              status: "Estado",
              createdAt: "Creado",
              updatedAt: "Actualizado"
            },
            account: {
              heading: "Resumen de cuenta",
              description: "Cargos y pagos registrados para este cliente.",
              balanceLabel: "Saldo pendiente",
              chargedLabel: "Total facturado",
              paidLabel: "Total cobrado",
              hourlyLabel: "Horas facturables",
              packLabel: "Packs de horas",
              historyHeading: "Historial de cuenta",
              empty: "Todavía no hay movimientos registrados.",
              table: {
                date: "Fecha",
                type: "Tipo",
                description: "Descripción",
                reference: "Referencia",
                amount: "Importe",
                recordedBy: "Registrado por"
              },
              entryTypes: {
                charge: "Cargo",
                payment: "Pago"
              },
              noDescription: "—",
              packsHeading: "Packs de horas a facturar",
              packsDescription: "Estos packs se están facturando a este cliente. Los pagos reducen automáticamente el saldo pendiente.",
              packHours: "{{hours}} horas incluidas",
              packHoursFallback: "Horas no especificadas",
              hourlyHeading: "Horas facturables pendientes",
              hourlyDescription: "Tiempo facturable registrado en proyectos por horas para este cliente.",
              hourlyHours: "{{hours}} horas registradas",
              paymentForm: {
                title: "Registrar pago",
                subtitle: "Registra un pago recibido para mantener el saldo al día.",
                amountLabel: "Importe recibido",
                amountPlaceholder: "0,00",
                amountRequired: "Introduce el importe del pago.",
                dateLabel: "Fecha del pago",
                methodLabel: "Medio de pago",
                methodPlaceholder: "Ej. Transferencia bancaria, Tarjeta",
                referenceLabel: "Referencia",
                referencePlaceholder: "ID de recibo o transacción (opcional)",
                descriptionLabel: "Descripción",
                descriptionPlaceholder: "Nota breve opcional visible en el historial",
                notesLabel: "Notas internas",
                notesPlaceholder: "Contexto adicional para el equipo (opcional).",
                submit: "Guardar pago",
                submitting: "Guardando...",
                success: "Pago registrado correctamente."
              },
              errors: {
                paymentFallback: "No se pudo registrar el pago. Inténtalo de nuevo.",
                loadFallback: "No se pudieron cargar los datos de la cuenta. Actualiza la página."
              }
            }
          }
        },
        projects: {
          title: "Projects",
          subtitle: "Monitor delivery, billing and visibility for every active engagement.",
          actions: {
            newProject: "New project",
            creating: "Creating...",
            create: "Create project",
            active: "Activate",
            paused: "Pause",
            archived: "Archive"
          },
          filters: {
            statusLabel: "Status",
            statusAll: "All statuses",
            visibilityLabel: "Visibility",
            visibilityAll: "All visibilities",
            searchLabel: "Search",
            searchPlaceholder: "Search by name or client..."
          },
          stats: {
            total: "Total",
            active: "Active",
            paused: "Paused",
            archived: "Archived"
          },
          table: {
            name: "Project",
            client: "Client",
            status: "Status",
            visibility: "Visibility",
            billing: "Billing",
            hours: "Hours logged",
            updated: "Updated"
          },
          status: {
            active: "Active",
            paused: "Paused",
            archived: "Archived"
          },
          visibility: {
            client: "Client-facing",
            internal: "Internal"
          },
          billing: {
            hourly: "Hourly",
            pack: "Fixed pack"
          },
          modal: {
            title: "Create project",
            description: "Define the essentials so the team and the client stay aligned.",
            fields: {
              name: "Project name",
              client: "Client",
              description: "Description",
              status: "Status",
              visibility: "Visibility",
              billingType: "Billing model",
              hourlyRate: "Hourly rate",
              currency: "Currency",
              packHours: "Pack hours",
              packValue: "Pack value"
            },
            placeholders: {
              name: "e.g. Mobile app redesign",
              client: "Select a client",
              description: "Key goals, deliverables or scope notes.",
              hourlyRate: "e.g. 60",
              packHours: "e.g. 40",
              packValue: "e.g. 2400"
            },
            helpers: {
              hourlyRate: "Define the default hourly rate applied to time entries.",
              pack: "For fixed packs, inform the number of hours and the contracted value."
            }
          },
          validations: {
            nameRequired: "Provide a project name.",
            clientRequired: "Select a client for this project.",
            hourlyRate: "Set the hourly rate for this project.",
            packDetails: "Provide both pack hours and pack value."
          },
          errors: {
            createFallback: "We couldn't create the project. Please try again.",
            fetchFallback: "We couldn't load the projects right now."
          },
          empty: "No projects found."
        },
        reports: {
          title: "Informes",
          subtitle: "Resúmenes por proyecto y usuario con exportación segura.",
          filters: {
            label: "Filtro:",
            all: "Todos",
            billable: "Facturables",
            nonBillable: "No facturables"
          },
          cards: {
            totalHours: "Horas totales",
            projects: "Proyectos",
            billedAmount: "Valor facturado"
          },
          chart: {
            unknownProject: "Desconocido",
            loading: "Cargando gráfico..."
          },
          table: {
            project: "Proyecto",
            client: "Cliente",
            hours: "Horas",
            billable: "Facturable",
            nonBillable: "No facturable",
            amount: "Valor",
            empty: "Sin datos para el filtro seleccionado."
          }
        }
      },
      client: {
        dashboard: {
          title: "Panel del cliente",
          subtitle: "Resumen de proyectos, horas y facturación.",
          cards: {
            assignedProjects: "Proyectos asignados",
            totalHours: "Horas totales",
            billableHours: "Horas facturables",
            outstandingBalance: "Saldo pendiente"
          },
          sections: {
            distribution: "Distribución por proyecto",
            distributionHint: "Horas registradas por proyecto"
          },
          chart: {
            unknownProject: "Proyecto"
          },
          packs: {
            title: "Packs de horas",
            subtitle: "Controla cuánto se ha utilizado de cada pack.",
            empty: "No hay packs de horas disponibles para este cliente.",
            noLimit: "Ilimitado",
            totalValue: "Valor del pack: {{value}}",
            noHoursDefined: "Horas del pack no definidas para este proyecto."
          }
        },
        projects: {
          title: "Proyectos",
          subtitle: "Listado de proyectos visibles para el cliente y su progreso de horas.",
          table: {
            name: "Nombre",
            hours: "Horas",
            lastEntry: "Último registro",
            status: "Estado"
          },
          status: {
            active: "Activo",
            paused: "Pausado",
            unknown: "Desconocido"
          },
          lastEntryNone: "—",
          empty: "Sin proyectos disponibles."
        },
        reports: {
          title: "Informes",
          subtitle: "Controla las horas registradas y la facturación de tus proyectos.",
          filters: {
            monthLabel: "Mes",
            monthAll: "Todos los meses",
            billableLabel: "Facturación",
            billableAll: "Todos los registros",
            billableOnly: "Solo facturables",
            nonBillableOnly: "Solo no facturables",
            searchLabel: "Búsqueda",
            searchPlaceholder: "Buscar por proyecto...",
            reset: "Restablecer filtros"
          },
          summary: {
            totalHours: "Horas totales",
            billableHours: "Horas facturables",
            nonBillableHours: "Horas no facturables",
            totalAmount: "Importe total"
          },
          table: {
            project: "Proyecto",
            projectUnknown: "—",
            hours: "Horas totales",
            billable: "Horas facturables",
            nonBillable: "Horas no facturables",
            amount: "Importe",
            empty: "No hay datos para los filtros seleccionados."
          }
        }
      }
    }
  },
  fr: {
    translation: {
      common: {
        appName: "Worktrace",
        roles: {
          admin: "Administrateur",
          client: "Client",
          manager: "Responsable",
          member: "Membre"
        },
        status: {
          active: "Actif",
          inactive: "Inactif"
        },
        actions: {
          close: "Fermer",
          cancel: "Annuler",
          remove: "Supprimer"
        },
        loading: "Chargement..."
      },
      header: {
        fallbackClientName: "Client Worktrace",
        openNavigation: "Ouvrir la navigation",
        languageLabel: "Langue",
        languages: {
          en: "Anglais",
          es: "Espagnol",
          fr: "Français",
          pt: "Portugais"
        },
        logout: "Déconnexion"
      },
      theme: {
        toggle: "Changer de thème"
      },
      sidebar: {
        iconAlt: "Icône Worktrace",
        tagline: "Temps et transparence",
        links: {
          dashboard: "Tableau de bord",
          clients: "Clients",
          projects: "Projets",
          assignments: "Affectations",
          timeEntries: "Heures",
          reports: "Rapports",
          settings: "Paramètres"
        },
        supportLabel: "Support :",
        supportEmail: "support@worktrace.app",
        accessibilityNote: "Mise à jour conforme WCAG AA et cookies HttpOnly."
      },
      login: {
        title: "Se connecter à la plateforme",
        subtitle: "Gérez les heures et la transparence depuis un seul tableau de bord.",
        formAriaLabel: "Formulaire de connexion",
        fields: {
          email: {
            label: "E-mail",
            placeholder: "admin@worktrace.demo"
          },
          password: {
            label: "Mot de passe",
            placeholder: "••••••••"
          }
        },
        errors: {
          emailRequired: "L'e-mail est obligatoire.",
          passwordRequired: "Le mot de passe est obligatoire."
        },
        actions: {
          authenticating: "Connexion...",
          submit: "Se connecter"
        },
        securityNote:
          "Les cookies HttpOnly et le CSRF protègent votre accès. Pour toute assistance, contactez support@worktrace.app."
      },
      admin: {
        dashboard: {
          chart: {
            unknownProject: "Inconnu"
          },
          cards: {
            totalHours: "Total d'heures",
            billable: "Facturable",
            nonBillable: "Non facturable",
            billedAmount: "Total facturé"
          },
          sections: {
            byProject: {
              title: "Heures par projet",
              description: "Comparaison hebdomadaire des heures facturables vs non facturables."
            },
            activeProjects: {
              title: "Projets actifs",
              description: "Derniers projets avec activité récente.",
              badge: "Mis à jour",
              updated: "Mis à jour le {{date}}"
            }
          }
        },
        assignments: {
          title: "Affectations",
          subtitle: "Contrôlez qui peut enregistrer le temps et avec quelles permissions pour chaque projet.",
          actions: {
            new: "Nouvelle affectation",
            assigning: "Affectation...",
            save: "Enregistrer l'affectation"
          },
          errors: {
            createFallback: "Impossible de créer l'affectation. Veuillez réessayer.",
            projectRequired: "Sélectionnez un projet à affecter.",
            userRequired: "Sélectionnez un administrateur à affecter."
          },
          table: {
            project: "Projet",
            user: "Utilisateur",
            role: "Rôle",
            status: "Statut",
            empty: "Aucune affectation enregistrée."
          },
          modal: {
            title: "Nouvelle affectation",
            description: "Assignez un administrateur chargé de suivre le travail sur ce projet."
          },
          form: {
            projectLabel: "Projet",
            projectPlaceholder: "Sélectionnez un projet",
            userLabel: "Utilisateur administrateur",
            userPlaceholder: "Sélectionnez un utilisateur",
            roleLabel: "Rôle"
          }
        },
        timeEntries: {
          title: "Suivi du temps",
          subtitle: "Surveillez les enregistrements, contrôlez les chronomètres en direct et exportez des données à partager avec le client.",
          filters: {
            projectLabel: "Projet",
            projectAll: "Tous les projets",
            fromLabel: "De",
            toLabel: "À"
          },
          actions: {
            exportCsv: "Exporter CSV",
            exportPdf: "Exporter PDF",
            startTimer: "Démarrer le chronomètre",
            refresh: "Actualiser",
            pause: "Mettre en pause",
            resume: "Reprendre",
            stop: "Arrêter"
          },
          activeTimers: {
            title: "Chronomètres actifs",
            description: "Suivez le travail en cours et mettez-le en pause ou arrêtez-le dès que nécessaire.",
            loading: "Chargement des chronomètres...",
            empty: "Aucun chronomètre actif pour le moment.",
            elapsedLabel: "Temps écoulé",
            statusLabel: "Statut : {{status}}",
            statuses: {
              running: "En cours",
              paused: "En pause"
            },
            startedAt: "Démarré le {{datetime}}"
          },
          table: {
            headers: {
              date: "Date",
              project: "Projet",
              user: "Utilisateur",
              task: "Tâche",
              duration: "Durée",
              billable: "Facturable"
            },
            loading: "Chargement des enregistrements...",
            billableYes: "Oui",
            billableNo: "Non",
            empty: "Aucun enregistrement pour la période sélectionnée."
          },
          details: {
            overview: "Aperçu de l'entrée",
            duration: "Durée enregistrée",
            billable: "Facturable ?",
            timeRange: "Plage horaire",
            timeRangeFallback: "Heures de début/fin non enregistrées",
            hourlyRate: "Tarif horaire",
            amount: "Montant calculé",
            meta: "Informations complémentaires",
            client: "Client",
            task: "Tâche",
            summaryTitle: "Résumé"
          },
          startModal: {
            title: "Démarrer le chronomètre",
            description: "Choisissez le projet et ajoutez du contexte si besoin avant de lancer la session.",
            projectLabel: "Projet",
            projectPlaceholder: "Sélectionnez un projet",
            notesLabel: "Notes initiales (optionnel)",
            notesPlaceholder: "Sur quoi allez-vous travailler durant cette session ?",
            submit: "Commencer",
            submitting: "Démarrage..."
          },
          stopModal: {
            title: "Arrêter le chronomètre",
            description: "Résumez le travail livré pour que le client comprenne la valeur fournie.",
            summaryLabel: "Qu'est-ce qui a été fait ?",
            summaryPlaceholder: "Décrivez les tâches réalisées, décisions prises ou blocages rencontrés.",
            taskLabel: "Titre de la tâche (optionnel)",
            taskPlaceholder: "Ex. Sprint UX KoalaClub",
            billableToggle: "Marquer comme facturable",
            totalTime: "Temps total : {{duration}}",
            submit: "Enregistrer l'entrée",
            submitting: "Enregistrement..."
          },
          validations: {
            projectRequired: "Sélectionnez un projet avant de démarrer.",
            summaryRequired: "Ajoutez un résumé pour que le client comprenne le travail."
          },
          errors: {
            start: "Impossible de démarrer le chronomètre. Veuillez réessayer.",
            pause: "Impossible de mettre en pause le chronomètre. Veuillez réessayer.",
            resume: "Impossible de reprendre le chronomètre. Veuillez réessayer.",
            stop: "Impossible d'arrêter le chronomètre. Veuillez réessayer."
          }
        },
        settings: {
          title: "Paramètres",
          subtitle: "Gérez l'identité de l'entreprise, les emails par défaut et les identifiants SMTP de Worktrace.",
          lastUpdated: "Dernière mise à jour le {{datetime}}",
          feedback: {
            success: "Paramètres enregistrés avec succès.",
            error: "Impossible d'enregistrer les paramètres. Veuillez réessayer."
          },
          validations: {
            port: "Indiquez un port SMTP valide (nombre positif)."
          },
          company: {
            title: "Identité de l'entreprise",
            description: "Informations utilisées dans les rapports, emails et communications client.",
            fields: {
              name: {
                label: "Nom commercial",
                placeholder: "Worktrace"
              },
              legalName: {
                label: "Raison sociale",
                placeholder: "Worktrace SARL"
              },
              email: {
                label: "Email général",
                placeholder: "info@worktrace.app"
              },
              phone: {
                label: "Téléphone",
                placeholder: "+33 1 84 00 00 00"
              },
              website: {
                label: "Site web",
                placeholder: "https://worktrace.app"
              },
              vat: {
                label: "TVA / SIREN",
                placeholder: "FR999999999"
              },
              address: {
                label: "Adresse",
                placeholder: "123 rue des Startups\n75001 Paris"
              },
              logo: {
                label: "Logo",
                alt: "Logo actuel",
                empty: "Aucun logo",
                guidelines: "Formats acceptés : PNG, JPG, SVG. Taille recommandée : 200x200px.",
                remove: "Supprimer le logo",
                undoRemove: "Annuler la suppression",
                removeWarning: "Le logo sera supprimé lors de l'enregistrement."
              }
            }
          },
          emails: {
            title: "Emails par défaut",
            description: "Configurez les adresses utilisées pour les notifications, le support et la facturation.",
            fields: {
              supportEmail: {
                label: "Email support",
                placeholder: "support@worktrace.app"
              },
              billingEmail: {
                label: "Email facturation",
                placeholder: "billing@worktrace.app"
              },
              defaultSenderName: {
                label: "Nom de l'expéditeur",
                placeholder: "Équipe Worktrace"
              },
              defaultSenderEmail: {
                label: "Email de l'expéditeur",
                placeholder: "noreply@worktrace.app"
              },
              replyToEmail: {
                label: "Email de réponse",
                placeholder: "contact@worktrace.app"
              }
            }
          },
          smtp: {
            title: "Serveur d'email (SMTP)",
            description: "Définissez comment Worktrace envoie les messages transactionnels et les notifications.",
            fields: {
              host: {
                label: "Hôte SMTP",
                placeholder: "smtp.mailprovider.com"
              },
              port: {
                label: "Port",
                placeholder: "587"
              },
              username: {
                label: "Utilisateur SMTP",
                placeholder: "apikey"
              },
              password: {
                label: "Mot de passe SMTP",
                placeholder: ""
              }
            },
            passwordHintExisting: "Laissez vide pour conserver le mot de passe actuel ou saisissez-en un nouveau pour le remplacer.",
            passwordHintNew: "Saisissez le mot de passe fourni par votre service d'email.",
            toggles: {
              tls: "Utiliser TLS (STARTTLS)",
              ssl: "Utiliser SSL"
            },
            guidance: "Activez une seule option : TLS est recommandé pour le port 587, SSL pour le port 465."
          },
          form: {
            submit: "Enregistrer les paramètres",
            submitting: "Enregistrement..."
          }
        },
        clients: {
          title: "Clients",
          subtitle: "Gérez les fiches clients avec statut et coordonnées.",
          actions: {
            add: "Ajouter un client",
            creating: "Création...",
            save: "Enregistrer le client"
          },
          errors: {
            createFallback: "Impossible de créer le client. Veuillez réessayer.",
            requiredFields: "Le nom et l'e-mail sont obligatoires."
          },
          list: {
            searchPlaceholder: "Rechercher par nom ou e-mail...",
            searchAria: "Recherche de clients",
            count_one: "{{count}} client visible",
            count_other: "{{count}} clients visibles",
            openDetail: "Voir le compte de {{name}}"
          },
          table: {
            client: "Client",
            email: "E-mail",
            vat: "Numéro de TVA",
            status: "Statut",
            empty: "Aucun résultat pour cette recherche."
          },
          modal: {
            title: "Ajouter un nouveau client",
            description: "Renseignez les informations du client et partagez le mot de passe temporaire."
          },
          success: {
            title: "Client créé avec succès.",
            passwordLabel: "Mot de passe temporaire pour",
            copyPassword: "Copier le mot de passe",
            complete: "Terminer",
            passwordReminder: "Demandez au client de changer le mot de passe lors du premier accès."
          },
          form: {
            nameLabel: "Nom",
            namePlaceholder: "Ex. Entreprise XPTO",
            emailLabel: "E-mail",
            emailPlaceholder: "client@entreprise.com",
            vatLabel: "Numéro de TVA",
            vatPlaceholder: "Facultatif",
            notesLabel: "Notes",
            notesPlaceholder: "Informations complémentaires pour l'équipe interne.",
            logoLabel: "Logo du client",
            fileSelected: "Sélectionné : {{filename}}",
            fileHelp: "Formats image acceptés (PNG, JPG, SVG). Max 5 Mo."
          },
          details: {
            title: "Détails du client",
            subtitle: "Consultez les coordonnées et le solde en un coup d'œil.",
            about: {
              heading: "Informations client",
              email: "E-mail",
              vat: "Numéro de TVA",
              noVat: "Non renseigné",
              notes: "Notes",
              noNotes: "Aucune note.",
              status: "Statut",
              createdAt: "Création",
              updatedAt: "Mise à jour"
            },
            account: {
              heading: "Vue d'ensemble du compte",
              description: "Charges et paiements enregistrés pour ce client.",
              balanceLabel: "Solde dû",
              chargedLabel: "Total facturé",
              paidLabel: "Total encaissé",
              hourlyLabel: "Heures facturables",
              packLabel: "Packs d'heures",
              historyHeading: "Historique du compte",
              empty: "Aucun mouvement enregistré pour le moment.",
              table: {
                date: "Date",
                type: "Type",
                description: "Description",
                reference: "Référence",
                amount: "Montant",
                recordedBy: "Enregistré par"
              },
              entryTypes: {
                charge: "Charge",
                payment: "Paiement"
              },
              noDescription: "—",
              packsHeading: "Packs d'heures à facturer",
              packsDescription: "Ces packs sont facturés à ce client. Les paiements réduisent automatiquement le solde restant.",
              packHours: "{{hours}} heures incluses",
              packHoursFallback: "Heures non précisées",
              hourlyHeading: "Heures facturables à facturer",
              hourlyDescription: "Temps facturable enregistré sur les projets facturés à l'heure pour ce client.",
              hourlyHours: "{{hours}} heures enregistrées",
              paymentForm: {
                title: "Enregistrer un paiement",
                subtitle: "Saisissez un paiement reçu pour maintenir le solde à jour.",
                amountLabel: "Montant reçu",
                amountPlaceholder: "0,00",
                amountRequired: "Indiquez le montant du paiement.",
                dateLabel: "Date du paiement",
                methodLabel: "Mode de paiement",
                methodPlaceholder: "ex. Virement, Carte",
                referenceLabel: "Référence",
                referencePlaceholder: "Reçu ou identifiant de transaction (optionnel)",
                descriptionLabel: "Description",
                descriptionPlaceholder: "Note courte optionnelle visible dans l'historique",
                notesLabel: "Notes internes",
                notesPlaceholder: "Contexte supplémentaire pour l'équipe (optionnel).",
                submit: "Enregistrer le paiement",
                submitting: "Enregistrement...",
                success: "Paiement enregistré avec succès."
              },
              errors: {
                paymentFallback: "Impossible d'enregistrer le paiement. Veuillez réessayer.",
                loadFallback: "Impossible de charger les informations du compte. Veuillez actualiser."
              }
            }
          }
        },
        projects: {
          title: "Projets",
          subtitle: "Suivez la livraison, la facturation et la visibilité de chaque mission.",
          actions: {
            newProject: "Nouveau projet",
            creating: "Création...",
            create: "Créer le projet",
            active: "Activer",
            paused: "Mettre en pause",
            archived: "Archiver"
          },
          filters: {
            statusLabel: "Statut",
            statusAll: "Tous les statuts",
            visibilityLabel: "Visibilité",
            visibilityAll: "Toutes les visibilités",
            searchLabel: "Recherche",
            searchPlaceholder: "Rechercher par nom ou client..."
          },
          stats: {
            total: "Total",
            active: "Actifs",
            paused: "En pause",
            archived: "Archivés"
          },
          table: {
            name: "Projet",
            client: "Client",
            status: "Statut",
            visibility: "Visibilité",
            billing: "Facturation",
            hours: "Heures suivies",
            updated: "Mis à jour"
          },
          status: {
            active: "Actif",
            paused: "En pause",
            archived: "Archivé"
          },
          visibility: {
            client: "Visible client",
            internal: "Interne"
          },
          billing: {
            hourly: "À l'heure",
            pack: "Forfait fixe"
          },
          modal: {
            title: "Créer un projet",
            description: "Renseignez les informations clés pour garder l'équipe et le client alignés.",
            fields: {
              name: "Nom du projet",
              client: "Client",
              description: "Description",
              status: "Statut",
              visibility: "Visibilité",
              billingType: "Modèle de facturation",
              hourlyRate: "Tarif horaire",
              currency: "Devise",
              packHours: "Heures du forfait",
              packValue: "Valeur du forfait"
            },
            placeholders: {
              name: "Ex. Refonte application mobile",
              client: "Sélectionnez un client",
              description: "Objectifs, livrables ou notes de périmètre.",
              hourlyRate: "Ex. 60",
              packHours: "Ex. 40",
              packValue: "Ex. 2400"
            },
            helpers: {
              hourlyRate: "Définissez le tarif horaire appliqué aux feuilles de temps.",
              pack: "Pour les forfaits, précisez les heures incluses et la valeur vendue."
            }
          },
          validations: {
            nameRequired: "Indiquez un nom de projet.",
            clientRequired: "Sélectionnez un client pour ce projet.",
            hourlyRate: "Définissez le tarif horaire du projet.",
            packDetails: "Indiquez les heures et la valeur du forfait."
          },
          errors: {
            createFallback: "Impossible de créer le projet. Veuillez réessayer.",
            fetchFallback: "Impossible de charger les projets pour le moment."
          },
          empty: "Aucun projet trouvé."
        },
        reports: {
          title: "Rapports",
          subtitle: "Synthèses par projet et utilisateur avec export sécurisé.",
          filters: {
            label: "Filtre :",
            all: "Tous",
            billable: "Facturable",
            nonBillable: "Non facturable"
          },
          cards: {
            totalHours: "Total d'heures",
            projects: "Projets",
            billedAmount: "Montant facturé"
          },
          chart: {
            unknownProject: "Inconnu",
            loading: "Chargement du graphique..."
          },
          table: {
            project: "Projet",
            client: "Client",
            hours: "Heures",
            billable: "Facturable",
            nonBillable: "Non facturable",
            amount: "Montant",
            empty: "Aucune donnée pour le filtre sélectionné."
          }
        }
      },
      client: {
        dashboard: {
          title: "Tableau de bord client",
          subtitle: "Vue d'ensemble de vos projets, heures et facturation.",
          cards: {
            assignedProjects: "Projets attribués",
            totalHours: "Total d'heures",
            billableHours: "Heures facturables",
            outstandingBalance: "Solde à régler"
          },
          sections: {
            distribution: "Répartition par projet",
            distributionHint: "Heures enregistrées par projet"
          },
          chart: {
            unknownProject: "Projet"
          },
          packs: {
            title: "Forfaits d'heures",
            subtitle: "Suivez l'utilisation de chaque forfait.",
            empty: "Aucun forfait d'heures disponible pour ce client.",
            noLimit: "Illimité",
            totalValue: "Valeur du forfait : {{value}}",
            noHoursDefined: "Heures du forfait non définies pour ce projet."
          }
        },
        projects: {
          title: "Projets",
          subtitle: "Liste des projets visibles par le client avec le suivi des heures.",
          table: {
            name: "Nom",
            hours: "Heures",
            lastEntry: "Dernier enregistrement",
            status: "Statut"
          },
          status: {
            active: "Actif",
            paused: "En pause",
            unknown: "Inconnu"
          },
          lastEntryNone: "—",
          empty: "Aucun projet disponible."
        },
        reports: {
          title: "Rapports",
          subtitle: "Suivez les heures enregistrées et la facturation de vos projets.",
          filters: {
            monthLabel: "Mois",
            monthAll: "Tous les mois",
            billableLabel: "Facturation",
            billableAll: "Toutes les entrées",
            billableOnly: "Uniquement facturables",
            nonBillableOnly: "Uniquement non facturables",
            searchLabel: "Recherche",
            searchPlaceholder: "Rechercher par projet...",
            reset: "Réinitialiser les filtres"
          },
          summary: {
            totalHours: "Total d'heures",
            billableHours: "Heures facturables",
            nonBillableHours: "Heures non facturables",
            totalAmount: "Montant total"
          },
          table: {
            project: "Projet",
            projectUnknown: "—",
            hours: "Total d'heures",
            billable: "Heures facturables",
            nonBillable: "Heures non facturables",
            amount: "Montant",
            empty: "Aucune donnée pour les filtres sélectionnés."
          }
        }
      }
    }
  },
  pt: {
    translation: {
      common: {
        appName: "Worktrace",
        roles: {
          admin: "Administrador",
          client: "Cliente",
          manager: "Gestor",
          member: "Membro"
        },
        status: {
          active: "Ativo",
          inactive: "Inativo"
        },
        actions: {
          close: "Fechar",
          cancel: "Cancelar",
          remove: "Remover"
        },
        loading: "A carregar..."
      },
      header: {
        fallbackClientName: "Cliente Worktrace",
        openNavigation: "Abrir navegação",
        languageLabel: "Idioma",
        languages: {
          en: "Inglês",
          es: "Espanhol",
          fr: "Francês",
          pt: "Português"
        },
        logout: "Terminar sessão"
      },
      theme: {
        toggle: "Alternar tema"
      },
      sidebar: {
        iconAlt: "Ícone Worktrace",
        tagline: "Tempo e transparência",
        links: {
          dashboard: "Dashboard",
          clients: "Clientes",
          projects: "Projetos",
          assignments: "Atribuições",
          timeEntries: "Horas",
          reports: "Relatórios",
          settings: "Definições"
        },
        supportLabel: "Suporte:",
        supportEmail: "support@worktrace.app",
        accessibilityNote: "Actualizado para WCAG AA e cookies HttpOnly."
      },
      login: {
        title: "Entrar na plataforma",
        subtitle: "Controle de horas e transparência num só painel.",
        formAriaLabel: "Formulário de login",
        fields: {
          email: {
            label: "Email",
            placeholder: "admin@worktrace.demo"
          },
          password: {
            label: "Password",
            placeholder: "••••••••"
          }
        },
        errors: {
          emailRequired: "Email é obrigatório.",
          passwordRequired: "Password é obrigatória."
        },
        actions: {
          authenticating: "A autenticar...",
          submit: "Entrar"
        },
        securityNote:
          "Cookies HttpOnly e CSRF protegem o seu acesso. Para suporte contacte support@worktrace.app."
      },
      admin: {
        dashboard: {
          chart: {
            unknownProject: "Desconhecido"
          },
          cards: {
            totalHours: "Total de horas",
            billable: "Faturável",
            nonBillable: "Não faturável",
            billedAmount: "Total faturado"
          },
          sections: {
            byProject: {
              title: "Horas por projeto",
              description: "Comparação semanal de horas faturáveis vs não faturáveis."
            },
            activeProjects: {
              title: "Projetos ativos",
              description: "Últimos projetos com atividade recente.",
              badge: "Atualizado",
              updated: "Atualizado {{date}}"
            }
          }
        },
        assignments: {
          title: "Atribuições",
          subtitle: "Controla quem pode registar tempo e com que permissões em cada projeto.",
          actions: {
            new: "Nova atribuição",
            assigning: "A atribuir...",
            save: "Guardar atribuição"
          },
          errors: {
            createFallback: "Não foi possível criar a atribuição. Tenta novamente.",
            projectRequired: "Seleciona um projeto para atribuir.",
            userRequired: "Seleciona um utilizador admin para atribuir."
          },
          table: {
            project: "Projeto",
            user: "Utilizador",
            role: "Papel",
            status: "Estado",
            empty: "Sem atribuições registadas."
          },
          modal: {
            title: "Nova atribuição",
            description: "Associa um administrador responsável por acompanhar o trabalho neste projeto."
          },
          form: {
            projectLabel: "Projeto",
            projectPlaceholder: "Seleciona um projeto",
            userLabel: "Utilizador admin",
            userPlaceholder: "Seleciona um utilizador",
            roleLabel: "Papel"
          }
        },
        timeEntries: {
          title: "Registo de horas",
          subtitle: "Monitoriza entradas de tempo, controla temporizadores ativos e exporta dados para partilhar com o cliente.",
          filters: {
            projectLabel: "Projeto",
            projectAll: "Todos os projetos",
            fromLabel: "Desde",
            toLabel: "Até"
          },
          actions: {
            exportCsv: "Exportar CSV",
            exportPdf: "Exportar PDF",
            startTimer: "Iniciar temporizador",
            refresh: "Atualizar",
            pause: "Pausar",
            resume: "Retomar",
            stop: "Parar"
          },
          activeTimers: {
            title: "Temporizadores ativos",
            description: "Acompanha o trabalho em curso e pausa ou termina quando necessário.",
            loading: "A carregar temporizadores...",
            empty: "Não existem temporizadores ativos.",
            elapsedLabel: "Tempo decorrido",
            statusLabel: "Estado: {{status}}",
            statuses: {
              running: "A contar",
              paused: "Em pausa"
            },
            startedAt: "Iniciado em {{datetime}}"
          },
          table: {
            headers: {
              date: "Data",
              project: "Projeto",
              user: "Utilizador",
              task: "Tarefa",
              duration: "Duração",
              billable: "Faturável"
            },
            loading: "A carregar registos...",
            billableYes: "Sim",
            billableNo: "Não",
            empty: "Sem registos neste período."
          },
          details: {
            overview: "Resumo do registo",
            duration: "Duração registada",
            billable: "Faturável?",
            timeRange: "Horário",
            timeRangeFallback: "Início/fim não registados",
            hourlyRate: "Valor à hora",
            amount: "Montante calculado",
            meta: "Informação adicional",
            client: "Cliente",
            task: "Tarefa",
            summaryTitle: "Resumo"
          },
          startModal: {
            title: "Iniciar temporizador",
            description: "Escolhe o projeto e, se quiseres, adiciona contexto antes de começares a sessão.",
            projectLabel: "Projeto",
            projectPlaceholder: "Seleciona um projeto",
            notesLabel: "Notas iniciais (opcional)",
            notesPlaceholder: "O que vais abordar nesta sessão?",
            submit: "Começar",
            submitting: "A iniciar..."
          },
          stopModal: {
            title: "Finalizar temporizador",
            description: "Resume o trabalho entregue para que o cliente perceba o valor.",
            summaryLabel: "O que foi feito?",
            summaryPlaceholder: "Detalha tarefas concluídas, decisões tomadas ou bloqueios encontrados.",
            taskLabel: "Título da tarefa (opcional)",
            taskPlaceholder: "Ex. Sprint de UX KoalaClub",
            billableToggle: "Marcar como faturável",
            totalTime: "Tempo total: {{duration}}",
            submit: "Guardar registo",
            submitting: "A registar..."
          },
          validations: {
            projectRequired: "Seleciona um projeto antes de iniciar.",
            summaryRequired: "Adiciona um resumo para que o cliente perceba o trabalho."
          },
          errors: {
            start: "Não foi possível iniciar o temporizador. Tenta novamente.",
            pause: "Não foi possível colocar o temporizador em pausa. Tenta novamente.",
            resume: "Não foi possível retomar o temporizador. Tenta novamente.",
            stop: "Não foi possível terminar o temporizador. Tenta novamente."
          }
        },
        settings: {
          title: "Definições",
          subtitle: "Gere a identidade da empresa, os emails padrão e as credenciais SMTP utilizadas pelo Worktrace.",
          lastUpdated: "Última atualização: {{datetime}}",
          feedback: {
            success: "Definições guardadas com sucesso.",
            error: "Não foi possível guardar as definições. Tenta novamente."
          },
          validations: {
            port: "Indica um porto SMTP válido (número positivo)."
          },
          company: {
            title: "Identidade da empresa",
            description: "Dados utilizados em relatórios, emails e comunicação com clientes.",
            fields: {
              name: {
                label: "Nome comercial",
                placeholder: "Worktrace"
              },
              legalName: {
                label: "Razão social",
                placeholder: "Worktrace Lda."
              },
              email: {
                label: "Email geral",
                placeholder: "info@worktrace.app"
              },
              phone: {
                label: "Telefone",
                placeholder: "+351 210 000 000"
              },
              website: {
                label: "Website",
                placeholder: "https://worktrace.app"
              },
              vat: {
                label: "NIF / VAT",
                placeholder: "PT999999999"
              },
              address: {
                label: "Morada",
                placeholder: "Rua das Startups, 123\n1000-001 Lisboa"
              },
              logo: {
                label: "Logótipo",
                alt: "Logótipo atual",
                empty: "Sem logótipo",
                guidelines: "Formatos suportados: PNG, JPG, SVG. Tamanho recomendado: 200x200px.",
                remove: "Remover logótipo",
                undoRemove: "Anular remoção",
                removeWarning: "O logótipo será removido ao guardar."
              }
            }
          },
          emails: {
            title: "Emails padrão",
            description: "Configura os endereços usados para notificações, suporte e faturação.",
            fields: {
              supportEmail: {
                label: "Email de suporte",
                placeholder: "support@worktrace.app"
              },
              billingEmail: {
                label: "Email de faturação",
                placeholder: "billing@worktrace.app"
              },
              defaultSenderName: {
                label: "Nome do remetente",
                placeholder: "Equipa Worktrace"
              },
              defaultSenderEmail: {
                label: "Email do remetente",
                placeholder: "noreply@worktrace.app"
              },
              replyToEmail: {
                label: "Email de resposta",
                placeholder: "contact@worktrace.app"
              }
            }
          },
          smtp: {
            title: "Servidor de email (SMTP)",
            description: "Define como o Worktrace envia mensagens transaccionais e notificações.",
            fields: {
              host: {
                label: "Servidor SMTP",
                placeholder: "smtp.mailprovider.com"
              },
              port: {
                label: "Porto",
                placeholder: "587"
              },
              username: {
                label: "Utilizador SMTP",
                placeholder: "apikey"
              },
              password: {
                label: "Palavra-passe SMTP",
                placeholder: ""
              }
            },
            passwordHintExisting: "Deixa em branco para manter a palavra-passe atual ou introduz uma nova para substituir.",
            passwordHintNew: "Indica a palavra-passe fornecida pelo teu serviço de email.",
            toggles: {
              tls: "Usar TLS (STARTTLS)",
              ssl: "Usar SSL"
            },
            guidance: "Ativa apenas uma opção: TLS é recomendado para o porto 587, SSL para o porto 465."
          },
          form: {
            submit: "Guardar definições",
            submitting: "A guardar..."
          }
        },
        clients: {
          title: "Clientes",
          subtitle: "Gestão de clientes com estatuto e contactos.",
          actions: {
            add: "Adicionar cliente",
            creating: "A criar...",
            save: "Guardar cliente"
          },
          errors: {
            createFallback: "Não foi possível criar o cliente. Tenta novamente.",
            requiredFields: "Nome e email são obrigatórios."
          },
          list: {
            searchPlaceholder: "Procurar por nome ou email...",
            searchAria: "Pesquisa de clientes",
            count_one: "{{count}} cliente visível",
            count_other: "{{count}} clientes visíveis",
            openDetail: "Ver conta de {{name}}"
          },
          table: {
            client: "Cliente",
            email: "Email",
            vat: "NIF/VAT",
            status: "Estado",
            empty: "Sem resultados para a pesquisa."
          },
          modal: {
            title: "Adicionar novo cliente",
            description: "Define os detalhes do cliente e partilha a password temporária."
          },
          success: {
            title: "Cliente criado com sucesso.",
            passwordLabel: "Password temporária para",
            copyPassword: "Copiar password",
            complete: "Concluir",
            passwordReminder: "Pede ao cliente para alterar a password no primeiro acesso."
          },
          form: {
            nameLabel: "Nome",
            namePlaceholder: "Ex. Empresa XPTO",
            emailLabel: "Email",
            emailPlaceholder: "cliente@empresa.com",
            vatLabel: "NIF/VAT",
            vatPlaceholder: "Opcional",
            notesLabel: "Notas",
            notesPlaceholder: "Informação adicional para a equipa interna.",
            logoLabel: "Logo do cliente",
            fileSelected: "Selecionado: {{filename}}",
            fileHelp: "Aceita formatos de imagem (PNG, JPG, SVG). Máx. 5MB."
          },
          details: {
            title: "Detalhes do cliente",
            subtitle: "Consulta os contactos e o saldo em dívida num só sítio.",
            about: {
              heading: "Informação do cliente",
              email: "Email",
              vat: "NIF",
              noVat: "Não indicado",
              notes: "Notas",
              noNotes: "Sem notas registadas.",
              status: "Estado",
              createdAt: "Criado em",
              updatedAt: "Atualizado em"
            },
            account: {
              heading: "Resumo da conta",
              description: "Movimentos de cobrança e pagamentos registados para este cliente.",
              balanceLabel: "Saldo em dívida",
              chargedLabel: "Total faturado",
              paidLabel: "Total recebido",
              hourlyLabel: "Horas faturáveis",
              packLabel: "Packs de horas",
              historyHeading: "Histórico da conta",
              empty: "Ainda não existem movimentos registados.",
              table: {
                date: "Data",
                type: "Tipo",
                description: "Descrição",
                reference: "Referência",
                amount: "Montante",
                recordedBy: "Registado por"
              },
              entryTypes: {
                charge: "Cobrança",
                payment: "Pagamento"
              },
              noDescription: "—",
              packsHeading: "Packs de horas a faturar",
              packsDescription: "Estes packs estão a ser faturados a este cliente. Os pagamentos reduzem automaticamente o saldo em dívida.",
              packHours: "{{hours}} horas incluídas",
              packHoursFallback: "Horas não indicadas",
              hourlyHeading: "Horas faturáveis por faturar",
              hourlyDescription: "Tempo faturável registado em projetos à hora para este cliente.",
              hourlyHours: "{{hours}} horas registadas",
              paymentForm: {
                title: "Registar pagamento",
                subtitle: "Regista um pagamento recebido para manter o saldo atualizado.",
                amountLabel: "Valor recebido",
                amountPlaceholder: "0,00",
                amountRequired: "Indica o valor do pagamento.",
                dateLabel: "Data do pagamento",
                methodLabel: "Método de pagamento",
                methodPlaceholder: "Ex. Transferência bancária, Cartão",
                referenceLabel: "Referência",
                referencePlaceholder: "ID de recibo ou transação (opcional)",
                descriptionLabel: "Descrição",
                descriptionPlaceholder: "Nota curta opcional visível no histórico",
                notesLabel: "Notas internas",
                notesPlaceholder: "Contexto adicional para a equipa (opcional).",
                submit: "Guardar pagamento",
                submitting: "A guardar...",
                success: "Pagamento registado com sucesso."
              },
              errors: {
                paymentFallback: "Não foi possível registar o pagamento. Tenta novamente.",
                loadFallback: "Não foi possível carregar a conta corrente. Atualiza a página."
              }
            }
          }
        },
        projects: {
          title: "Projetos",
          subtitle: "Acompanha entrega, faturação e visibilidade em cada iniciativa ativa.",
          actions: {
            newProject: "Novo projeto",
            creating: "A criar...",
            create: "Guardar projeto",
            active: "Ativar",
            paused: "Pausar",
            archived: "Arquivar"
          },
          filters: {
            statusLabel: "Estado",
            statusAll: "Todos os estados",
            visibilityLabel: "Visibilidade",
            visibilityAll: "Todas as visibilidades",
            searchLabel: "Pesquisa",
            searchPlaceholder: "Procurar por nome ou cliente..."
          },
          stats: {
            total: "Total",
            active: "Ativos",
            paused: "Pausados",
            archived: "Arquivados"
          },
          table: {
            name: "Projeto",
            client: "Cliente",
            status: "Estado",
            visibility: "Visibilidade",
            billing: "Faturação",
            hours: "Horas registadas",
            updated: "Atualizado"
          },
          status: {
            active: "Ativo",
            paused: "Pausado",
            archived: "Arquivado"
          },
          visibility: {
            client: "Visível ao cliente",
            internal: "Interno"
          },
          billing: {
            hourly: "À hora",
            pack: "Pacote fixo"
          },
          modal: {
            title: "Criar projeto",
            description: "Define a informação essencial para manter equipa e cliente alinhados.",
            fields: {
              name: "Nome do projeto",
              client: "Cliente",
              description: "Descrição",
              status: "Estado",
              visibility: "Visibilidade",
              billingType: "Modelo de faturação",
              hourlyRate: "Valor à hora",
              currency: "Moeda",
              packHours: "Horas do pacote",
              packValue: "Valor do pacote"
            },
            placeholders: {
              name: "Ex. Redesign app móvel",
              client: "Seleciona um cliente",
              description: "Objetivos, entregáveis ou notas de âmbito.",
              hourlyRate: "Ex. 60",
              packHours: "Ex. 40",
              packValue: "Ex. 2400"
            },
            helpers: {
              hourlyRate: "Define a taxa horária aplicada aos registos de tempo.",
              pack: "Para pacotes fixos, indica as horas contratadas e o valor."
            }
          },
          validations: {
            nameRequired: "Indica o nome do projeto.",
            clientRequired: "Seleciona um cliente para este projeto.",
            hourlyRate: "Define o valor à hora do projeto.",
            packDetails: "Indica as horas e o valor do pacote."
          },
          errors: {
            createFallback: "Não foi possível criar o projeto. Tenta novamente.",
            fetchFallback: "Não foi possível carregar os projetos neste momento."
          },
          empty: "Sem projetos encontrados."
        },
        reports: {
          title: "Relatórios",
          subtitle: "Resumos por projeto e utilizador com exportação segura.",
          filters: {
            label: "Filtro:",
            all: "Todos",
            billable: "Faturável",
            nonBillable: "Não faturável"
          },
          cards: {
            totalHours: "Horas totais",
            projects: "Projetos",
            billedAmount: "Valor faturado"
          },
          chart: {
            unknownProject: "Desconhecido",
            loading: "A carregar gráfico..."
          },
          table: {
            project: "Projeto",
            client: "Cliente",
            hours: "Horas",
            billable: "Faturável",
            nonBillable: "Não faturável",
            amount: "Valor",
            empty: "Sem dados para o filtro seleccionado."
          }
        }
      },
      client: {
        dashboard: {
          title: "Dashboard do cliente",
          subtitle: "Visão geral dos projetos, horas e faturação.",
          cards: {
            assignedProjects: "Projetos atribuídos",
            totalHours: "Horas totais",
            billableHours: "Horas faturáveis",
            outstandingBalance: "Saldo em dívida"
          },
          sections: {
            distribution: "Distribuição por projeto",
            distributionHint: "Horas registadas por projeto"
          },
          chart: {
            unknownProject: "Projeto"
          },
          packs: {
            title: "Packs de horas",
            subtitle: "Acompanha quanto de cada pack já foi utilizado.",
            empty: "Este cliente não tem packs de horas disponíveis.",
            noLimit: "Sem limite",
            totalValue: "Valor do pack: {{value}}",
            noHoursDefined: "Horas do pack não definidas para este projeto."
          }
        },
        projects: {
          title: "Projetos",
          subtitle: "Listado de projetos visíveis para o cliente e o progresso de horas.",
          table: {
            name: "Nome",
            hours: "Horas",
            lastEntry: "Último registo",
            status: "Estado"
          },
          status: {
            active: "Ativo",
            paused: "Pausado",
            unknown: "Desconhecido"
          },
          lastEntryNone: "—",
          empty: "Sem projetos disponíveis."
        },
        reports: {
          title: "Relatórios",
          subtitle: "Acompanha horas registadas e faturação em todos os projetos.",
          filters: {
            monthLabel: "Mês",
            monthAll: "Todos os meses",
            billableLabel: "Faturação",
            billableAll: "Todas as entradas",
            billableOnly: "Apenas faturáveis",
            nonBillableOnly: "Apenas não faturáveis",
            searchLabel: "Pesquisa",
            searchPlaceholder: "Pesquisar por projeto...",
            reset: "Repor filtros"
          },
          summary: {
            totalHours: "Horas totais",
            billableHours: "Horas faturáveis",
            nonBillableHours: "Horas não faturáveis",
            totalAmount: "Valor total"
          },
          table: {
            project: "Projeto",
            projectUnknown: "—",
            hours: "Horas totais",
            billable: "Horas faturáveis",
            nonBillable: "Horas não faturáveis",
            amount: "Valor",
            empty: "Sem dados para os filtros selecionados."
          }
        }
      }
    }
  }
} as const;


