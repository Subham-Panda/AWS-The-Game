# Cloud Resilience Tycoon 🌩️

**Build, Scale, and Survive the Cloud.**

A 3D simulation game where you architect a resilient cloud infrastructure to handle massive traffic spikes, defend against cyber attacks, and maintain 99.99% uptime.

## 🎮 Features

### 🏗️ 3D Infrastructure Builder
*   **Drag & Drop**: Build your architecture using **Gateways, Load Balancers, Web Servers, Databases, Caches, and S3 Buckets**.
*   **Visual Logic**: See traffic flow in real-time as colored packets moving through your system.
*   **Physics-based Interaction**: Connect nodes with cables to route traffic dynamically.

### 🚦 Realistic Simulation
*   **Smart Routing**: Traffic flows logically (Gateway -> LB -> Server -> DB).
*   **Bottlenecks**: Overloaded nodes will slow down and eventually crash.
*   **Caching**: Use Redis/Memcached nodes to offload read traffic from your databases.
*   **Dead Edges**: Misconfigured routes result in failed requests and lost revenue.

### 🛡️ Cyber Defense
*   **DDoS Attacks**: Massive spikes of malicious traffic that can overwhelm your servers.
*   **SQL Injection**: Targeted attacks on your database layer.
*   **Defensive Tools**: Deploy **WAFs (Web Application Firewalls)** to filter malicious packets before they reach your app.

### 🔬 Research & Development
*   **Tech Tree**: Unlock advanced capabilities like **Auto-Scaling Groups**, **Multi-AZ Deployment**, and **Global CDNs**.
*   **Progression**: Earn **Research Points (RP)** by successfully serving traffic to upgrade your tech stack.

### 💥 Chaos Engineering
*   **Inject Faults**: Intentionally break servers to test your redundancy.
*   **Self-Healing**: Build systems that automatically recover from failures.

## 🕹️ Controls

*   **Left Click**: Select Unit / Interact.
*   **Right Click + Drag**: Pan Camera.
*   **Scroll**: Zoom In/Out.
*   **Toolbar**: Select tools (Link, Demolish, Repair).

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open Game**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---
*Built by Subham Panda.*
