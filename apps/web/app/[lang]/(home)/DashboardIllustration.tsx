export function DashboardIllustration() {
    return (
        <svg
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-foreground"
        >
            <defs>
                {/* Primary gradient for main chart */}
                <linearGradient
                    id="gradientPrimary"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity="0.3"
                    />
                    <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity="0"
                    />
                </linearGradient>

                {/* Secondary gradient for secondary chart */}
                <linearGradient
                    id="gradientSecondary"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stopColor="hsl(var(--muted-foreground))"
                        stopOpacity="0.15"
                    />
                    <stop
                        offset="100%"
                        stopColor="hsl(var(--muted-foreground))"
                        stopOpacity="0"
                    />
                </linearGradient>

                {/* Accent gradient */}
                <linearGradient id="gradientAccent" x1="0" y1="0" x2="1" y2="1">
                    <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity="0.2"
                    />
                    <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity="0.05"
                    />
                </linearGradient>

                {/* Soft shadow filter */}
                <filter
                    id="softShadow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                >
                    <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
                </filter>

                {/* Blur filter for glassmorphic effect */}
                <filter id="blur">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
            </defs>

            {/* Background */}
            <rect width="1200" height="800" fill="hsl(var(--background))" />

            {/* === MAIN WINDOW CONTAINER === */}
            <g>
                {/* Outer border with subtle glow */}
                <rect
                    x="40"
                    y="40"
                    width="1120"
                    height="720"
                    rx="40"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                />

                {/* Subtle inner glow */}
                <rect
                    x="40"
                    y="40"
                    width="1120"
                    height="720"
                    rx="40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.5"
                    strokeOpacity="0.1"
                />
            </g>

            {/* === LEFT SIDEBAR === */}
            <g>
                <rect
                    x="50"
                    y="50"
                    width="240"
                    height="700"
                    rx="32"
                    fill="hsl(var(--muted))"
                    fillOpacity="0.5"
                />

                {/* Logo/Brand Area */}
                <circle
                    cx="90"
                    cy="100"
                    r="24"
                    fill="hsl(var(--primary))"
                    fillOpacity="0.8"
                />
                <rect
                    x="130"
                    y="90"
                    width="100"
                    height="12"
                    rx="4"
                    fill="hsl(var(--foreground))"
                    fillOpacity="0.7"
                />
                <rect
                    x="130"
                    y="110"
                    width="60"
                    height="8"
                    rx="3"
                    fill="hsl(var(--foreground))"
                    fillOpacity="0.4"
                />

                {/* Menu Items */}
                {[150, 210, 270, 330].map((yPos, idx) => (
                    <g key={yPos}>
                        <rect
                            x="70"
                            y={yPos}
                            width="180"
                            height="48"
                            rx="16"
                            fill={
                                idx === 0
                                    ? "hsl(var(--primary))"
                                    : "hsl(var(--muted-foreground))"
                            }
                            fillOpacity={idx === 0 ? 0.15 : 0}
                            stroke={
                                idx === 0
                                    ? "hsl(var(--primary))"
                                    : "transparent"
                            }
                            strokeWidth="1.5"
                        />
                        <circle
                            cx="95"
                            cy={yPos + 24}
                            r="5"
                            fill={
                                idx === 0
                                    ? "hsl(var(--primary))"
                                    : "hsl(var(--muted-foreground))"
                            }
                            fillOpacity={idx === 0 ? 0.8 : 0.5}
                        />
                        <rect
                            x="115"
                            y={yPos + 18}
                            width="110"
                            height="6"
                            rx="2"
                            fill={
                                idx === 0
                                    ? "hsl(var(--primary))"
                                    : "hsl(var(--muted-foreground))"
                            }
                            fillOpacity={idx === 0 ? 0.8 : 0.4}
                        />
                        {idx === 0 && (
                            <rect
                                x="115"
                                y={yPos + 28}
                                width="70"
                                height="4"
                                rx="1.5"
                                fill="hsl(var(--primary))"
                                fillOpacity="0.5"
                            />
                        )}
                    </g>
                ))}

                {/* Settings and Profile at bottom */}
                <g>
                    <line
                        x1="70"
                        y1="680"
                        x2="240"
                        y2="680"
                        stroke="hsl(var(--border))"
                        strokeWidth="0.5"
                    />
                    <circle
                        cx="95"
                        cy="725"
                        r="20"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.2"
                        stroke="hsl(var(--primary))"
                        strokeWidth="1.5"
                    />
                    <rect
                        x="125"
                        y="720"
                        width="95"
                        height="6"
                        rx="2"
                        fill="hsl(var(--foreground))"
                        fillOpacity="0.6"
                    />
                </g>
            </g>

            {/* === TOP HEADER / NAVIGATION === */}
            <g>
                {/* Header background */}
                <rect
                    x="300"
                    y="50"
                    width="860"
                    height="90"
                    rx="24"
                    fill="hsl(var(--muted))"
                    fillOpacity="0.3"
                    stroke="hsl(var(--border))"
                    strokeWidth="0.5"
                />

                {/* Search bar */}
                <g>
                    <rect
                        x="320"
                        y="70"
                        width="280"
                        height="50"
                        rx="16"
                        fill="hsl(var(--input))"
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                    />
                    <circle
                        cx="340"
                        cy="95"
                        r="4"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity="0.4"
                    />
                    <rect
                        x="360"
                        y="88"
                        width="140"
                        height="6"
                        rx="2"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity="0.3"
                    />
                </g>

                {/* Right side controls - three icons */}
                {[800, 870, 940].map((xPos) => (
                    <g key={xPos}>
                        <circle
                            cx={xPos}
                            cy="95"
                            r="22"
                            fill="hsl(var(--muted))"
                            fillOpacity="0.4"
                            stroke="hsl(var(--border))"
                            strokeWidth="0.5"
                        />
                        <circle
                            cx={xPos}
                            cy="95"
                            r="6"
                            fill="hsl(var(--foreground))"
                            fillOpacity={xPos === 800 ? 0.3 : 0.5}
                        />
                    </g>
                ))}

                {/* Notification dot */}
                <circle cx="895" cy="75" r="4" fill="hsl(var(--primary))" />
            </g>

            {/* === TOP METRICS CARDS === */}
            <g>
                {[
                    {
                        x: 320,
                        label: "Total Revenue",
                        value: "$48.5K",
                        change: "+12.5%",
                        type: "primary"
                    },
                    {
                        x: 560,
                        label: "Orders",
                        value: "2,847",
                        change: "+8.2%",
                        type: "secondary"
                    },
                    {
                        x: 800,
                        label: "Customers",
                        value: "1,294",
                        change: "+23.1%",
                        type: "secondary"
                    }
                ].map((card) => (
                    <g key={card.x}>
                        <rect
                            x={card.x}
                            y="160"
                            width="220"
                            height="140"
                            rx="20"
                            fill="hsl(var(--card))"
                            stroke="hsl(var(--border))"
                            strokeWidth="1"
                        />

                        {/* Card inner accent */}
                        <rect
                            x={card.x + 16}
                            y="176"
                            width={card.type === "primary" ? 60 : 50}
                            height="4"
                            rx="2"
                            fill="hsl(var(--primary))"
                            fillOpacity={card.type === "primary" ? 0.8 : 0.4}
                        />

                        {/* Label */}
                        <text
                            x={card.x + 20}
                            y="215"
                            fontSize="13"
                            fill="hsl(var(--muted-foreground))"
                            fontWeight="500"
                            fontFamily="system-ui"
                        >
                            {card.label}
                        </text>

                        {/* Value */}
                        <text
                            x={card.x + 20}
                            y="245"
                            fontSize="26"
                            fill="hsl(var(--foreground))"
                            fontWeight="700"
                            fontFamily="system-ui"
                        >
                            {card.value}
                        </text>

                        {/* Change indicator */}
                        <g>
                            <path
                                d={`M ${card.x + 180} 245 L ${card.x + 175} 235 L ${card.x + 170} 245`}
                                fill="hsl(var(--primary))"
                                fillOpacity="0.7"
                            />
                            <text
                                x={card.x + 165}
                                y="290"
                                fontSize="12"
                                fill="hsl(var(--primary))"
                                fontWeight="500"
                                fontFamily="system-ui"
                            >
                                {card.change}
                            </text>
                        </g>

                        {/* Sparkline chart */}
                        <path
                            d={`M ${card.x + 20} 280 Q ${card.x + 40} 270, ${card.x + 60} 278 Q ${card.x + 80} 286, ${card.x + 100} 273 Q ${card.x + 120} 260, ${card.x + 140} 275 Q ${card.x + 160} 290, ${card.x + 200} 280`}
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeOpacity="0.6"
                        />
                    </g>
                ))}
            </g>

            {/* === MAIN CHART AREA - LINE CHART === */}
            <g>
                <rect
                    x="320"
                    y="330"
                    width="540"
                    height="320"
                    rx="24"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                />

                {/* Chart title and legend */}
                <text
                    x="340"
                    y="360"
                    fontSize="16"
                    fontWeight="700"
                    fill="hsl(var(--foreground))"
                    fontFamily="system-ui"
                >
                    Sales Overview
                </text>

                {/* Legend items */}
                <g>
                    <circle
                        cx="460"
                        cy="350"
                        r="3"
                        fill="hsl(var(--primary))"
                    />
                    <text
                        x="475"
                        y="355"
                        fontSize="12"
                        fill="hsl(var(--muted-foreground))"
                        fontFamily="system-ui"
                    >
                        Revenue
                    </text>

                    <circle
                        cx="580"
                        cy="350"
                        r="3"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity="0.6"
                    />
                    <text
                        x="595"
                        y="355"
                        fontSize="12"
                        fill="hsl(var(--muted-foreground))"
                        fontFamily="system-ui"
                    >
                        Target
                    </text>
                </g>

                {/* Grid lines (horizontal) */}
                {[400, 460, 520, 580].map((y) => (
                    <line
                        key={y}
                        x1="350"
                        y1={y}
                        x2="820"
                        y2={y}
                        stroke="hsl(var(--border))"
                        strokeWidth="0.5"
                        strokeDasharray="3 3"
                    />
                ))}

                {/* Y-axis labels */}
                {[100, 75, 50, 25, 0].map((val, idx) => (
                    <text
                        key={val}
                        x="330"
                        y={400 + idx * 60}
                        fontSize="11"
                        fill="hsl(var(--muted-foreground))"
                        fontFamily="system-ui"
                        textAnchor="end"
                    >
                        ${val}K
                    </text>
                ))}

                {/* Main revenue line chart */}
                <path
                    d="M 350 500 L 420 420 L 490 450 L 560 350 L 630 380 L 700 300 L 770 360 L 840 320"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Gradient fill under main line */}
                <path
                    d="M 350 500 L 420 420 L 490 450 L 560 350 L 630 380 L 700 300 L 770 360 L 840 320 L 840 630 L 350 630 Z"
                    fill="url(#gradientPrimary)"
                />

                {/* Secondary target line (dashed) */}
                <path
                    d="M 350 480 L 420 430 L 490 460 L 560 365 L 630 390 L 700 320 L 770 370 L 840 340"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                    strokeOpacity="0.5"
                />

                {/* Data points on main line */}
                {[350, 420, 490, 560, 630, 700, 770, 840].map((x, idx) => {
                    const yValues = [500, 420, 450, 350, 380, 300, 360, 320];
                    return (
                        <circle
                            key={`${x}-${idx}`}
                            cx={x}
                            cy={yValues[idx]}
                            r="4"
                            fill="hsl(var(--background))"
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Highlight latest point */}
                <circle
                    cx="840"
                    cy="320"
                    r="8"
                    fill="hsl(var(--primary))"
                    fillOpacity="0.15"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                />

                {/* X-axis labels */}
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"].map(
                    (day, idx) => (
                        <text
                            key={day}
                            x={350 + idx * 70}
                            y="640"
                            fontSize="11"
                            fill="hsl(var(--muted-foreground))"
                            fontFamily="system-ui"
                            textAnchor="middle"
                        >
                            {day}
                        </text>
                    )
                )}
            </g>

            {/* === RIGHT SECTION - STATISTICS AND DATA === */}
            <g>
                {/* Top right box - Distribution */}
                <rect
                    x="880"
                    y="330"
                    width="280"
                    height="150"
                    rx="24"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                />

                <text
                    x="900"
                    y="360"
                    fontSize="14"
                    fontWeight="700"
                    fill="hsl(var(--foreground))"
                    fontFamily="system-ui"
                >
                    Top Categories
                </text>

                {/* Category items with bars */}
                {[
                    { label: "Electronics", value: 42, y: 385 },
                    { label: "Clothing", value: 28, y: 415 },
                    { label: "Home & Garden", value: 18, y: 445 }
                ].map((item) => (
                    <g key={item.label}>
                        <text
                            x="900"
                            y={item.y}
                            fontSize="12"
                            fill="hsl(var(--foreground))"
                            fontFamily="system-ui"
                        >
                            {item.label}
                        </text>
                        <rect
                            x="900"
                            y={item.y + 8}
                            width={item.value * 1.5}
                            height="6"
                            rx="3"
                            fill="hsl(var(--primary))"
                            fillOpacity="0.7"
                        />
                        <text
                            x="1130"
                            y={item.y + 13}
                            fontSize="11"
                            fill="hsl(var(--muted-foreground))"
                            fontFamily="system-us"
                        >
                            {item.value}%
                        </text>
                    </g>
                ))}

                {/* Bottom right box - Recent transactions */}
                <rect
                    x="880"
                    y="500"
                    width="280"
                    height="150"
                    rx="24"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                />

                <text
                    x="900"
                    y="530"
                    fontSize="14"
                    fontWeight="700"
                    fill="hsl(var(--foreground))"
                    fontFamily="system-ui"
                >
                    Recent Orders
                </text>

                {/* Transaction rows */}
                {[
                    {
                        id: "#ORD-2847",
                        amount: "+$2,450",
                        status: "Completed",
                        y: 555
                    },
                    {
                        id: "#ORD-2846",
                        amount: "+$1,820",
                        status: "Processing",
                        y: 585
                    },
                    {
                        id: "#ORD-2845",
                        amount: "+$3,180",
                        status: "Pending",
                        y: 615
                    }
                ].map((tx) => (
                    <g key={tx.id}>
                        <text
                            x="900"
                            y={tx.y}
                            fontSize="11"
                            fill="hsl(var(--foreground))"
                            fontWeight="500"
                            fontFamily="system-ui"
                        >
                            {tx.id}
                        </text>
                        <text
                            x="900"
                            y={tx.y + 20}
                            fontSize="10"
                            fill="hsl(var(--primary))"
                            fontWeight="600"
                            fontFamily="system-ui"
                        >
                            {tx.amount}
                        </text>
                        <circle
                            cx="1130"
                            cy={tx.y - 5}
                            r="3"
                            fill={
                                tx.status === "Completed"
                                    ? "hsl(var(--primary))"
                                    : "hsl(var(--muted-foreground))"
                            }
                            fillOpacity={tx.status === "Completed" ? 0.8 : 0.4}
                        />
                        <text
                            x="1140"
                            y={tx.y}
                            fontSize="9"
                            fill="hsl(var(--muted-foreground))"
                            fontFamily="system-ui"
                        >
                            {tx.status}
                        </text>
                    </g>
                ))}
            </g>

            {/* === BOTTOM SECTION - DONUT CHART === */}
            <g>
                <rect
                    x="320"
                    y="670"
                    width="260"
                    height="150"
                    rx="20"
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                />

                <text
                    x="340"
                    y="700"
                    fontSize="14"
                    fontWeight="700"
                    fill="hsl(var(--foreground))"
                    fontFamily="system-ui"
                >
                    Sales by Channel
                </text>

                {/* Simple donut visualization */}
                <circle
                    cx="450"
                    cy="747"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="12"
                    strokeDasharray="75 125"
                    strokeDashoffset="0"
                    opacity="0.8"
                />
                <circle
                    cx="450"
                    cy="747"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="12"
                    strokeDasharray="30 125"
                    strokeDashoffset="-75"
                    opacity="0.3"
                />
                <circle
                    cx="450"
                    cy="747"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="12"
                    strokeDasharray="20 125"
                    strokeDashoffset="-105"
                    opacity="0.15"
                />

                {/* Center text */}
                <text
                    x="450"
                    y="750"
                    fontSize="16"
                    fontWeight="700"
                    fill="hsl(var(--foreground))"
                    fontFamily="system-ui"
                    textAnchor="middle"
                >
                    100%
                </text>

                {/* Legend for donut */}
                <g>
                    <rect
                        x="510"
                        y="720"
                        width="8"
                        height="8"
                        rx="2"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.8"
                    />
                    <text
                        x="525"
                        y="727"
                        fontSize="11"
                        fill="hsl(var(--foreground))"
                        fontFamily="system-ui"
                    >
                        Direct 60%
                    </text>

                    <rect
                        x="510"
                        y="740"
                        width="8"
                        height="8"
                        rx="2"
                        fill="hsl(var(--muted-foreground))"
                        fillOpacity="0.3"
                    />
                    <text
                        x="525"
                        y="747"
                        fontSize="11"
                        fill="hsl(var(--foreground))"
                        fontFamily="system-ui"
                    >
                        Social 24%
                    </text>

                    <rect
                        x="510"
                        y="760"
                        width="8"
                        height="8"
                        rx="2"
                        fill="hsl(var(--primary))"
                        fillOpacity="0.15"
                    />
                    <text
                        x="525"
                        y="767"
                        fontSize="11"
                        fill="hsl(var(--foreground))"
                        fontFamily="system-ui"
                    >
                        Referral 16%
                    </text>
                </g>
            </g>

            {/* === DECORATIVE ELEMENTS === */}
            <g opacity="0.1">
                <circle cx="150" cy="750" r="150" fill="hsl(var(--primary))" />
                <circle cx="1050" cy="200" r="200" fill="hsl(var(--primary))" />
            </g>
        </svg>
    );
}

export function SalesDashboardIllustration() {
    return (
        <div className="w-full max-w-5xl mx-auto text-slate-900 dark:text-slate-100">
            <svg
                viewBox="0 0 900 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto"
            >
                {/* Background Card */}
                <rect
                    x="10"
                    y="10"
                    width="880"
                    height="480"
                    rx="20"
                    className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-700"
                />

                {/* Header */}
                <text
                    x="40"
                    y="50"
                    className="text-xl font-semibold fill-current"
                >
                    Sales Dashboard
                </text>

                {/* KPI Cards */}
                {[
                    { label: "Revenue", value: "$12.4k", x: 40 },
                    { label: "Orders", value: "320", x: 240 },
                    { label: "Customers", value: "1.2k", x: 440 }
                ].map((card, i) => (
                    <g key={i}>
                        <rect
                            x={card.x}
                            y="80"
                            width="160"
                            height="80"
                            rx="12"
                            className="fill-slate-50 dark:fill-slate-800"
                        />
                        <text
                            x={card.x + 16}
                            y="110"
                            className="text-sm fill-slate-500 dark:fill-slate-400"
                        >
                            {card.label}
                        </text>
                        <text
                            x={card.x + 16}
                            y="140"
                            className="text-lg font-bold fill-current"
                        >
                            {card.value}
                        </text>
                    </g>
                ))}

                {/* Line Chart */}
                <g>
                    <rect
                        x="40"
                        y="180"
                        width="500"
                        height="200"
                        rx="16"
                        className="fill-slate-50 dark:fill-slate-800"
                    />

                    {/* Grid lines */}
                    {[0, 1, 2, 3].map((i) => (
                        <line
                            key={i}
                            x1="60"
                            x2="520"
                            y1={220 + i * 40}
                            y2={220 + i * 40}
                            className="stroke-slate-200 dark:stroke-slate-700"
                        />
                    ))}

                    {/* Line path */}
                    <path
                        d="M60 320 L140 280 L220 300 L300 240 L380 260 L460 220"
                        className="stroke-blue-500 fill-none"
                        strokeWidth="3"
                    />

                    {/* Points */}
                    {[60, 140, 220, 300, 380, 460].map((x, i) => {
                        const y = [320, 280, 300, 240, 260, 220][i];
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                className="fill-blue-500"
                            />
                        );
                    })}
                </g>

                {/* Bar Chart */}
                <g>
                    <rect
                        x="560"
                        y="180"
                        width="280"
                        height="200"
                        rx="16"
                        className="fill-slate-50 dark:fill-slate-800"
                    />

                    {[50, 90, 70, 120, 80].map((h, i) => (
                        <rect
                            key={i}
                            x={590 + i * 45}
                            y={360 - h}
                            width="25"
                            height={h}
                            rx="6"
                            className="fill-blue-400 dark:fill-blue-500"
                        />
                    ))}
                </g>

                {/* Orders List */}
                <g>
                    <rect
                        x="40"
                        y="400"
                        width="800"
                        height="60"
                        rx="12"
                        className="fill-slate-50 dark:fill-slate-800"
                    />

                    {["#1023", "#1024", "#1025"].map((order, i) => (
                        <text
                            key={i}
                            x={60 + i * 200}
                            y="435"
                            className="text-sm fill-slate-600 dark:fill-slate-300"
                        >
                            {order} • ৳2,500
                        </text>
                    ))}
                </g>

                {/* Glow Accent */}
                <circle
                    cx="780"
                    cy="100"
                    r="60"
                    className="fill-blue-500 opacity-10"
                />
            </svg>
        </div>
    );
}
