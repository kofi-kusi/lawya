import logo from "../assets/scales-justice-symbol-law-legal-system.png"

export default function Sidebar() {
    return (
        <aside>
            <div className="sidebar-header">
                <img src={logo} alt="logo" className="logo-sidebar"/>
                <h3>Lawya</h3>
            </div>
            <hr />
            <div>
                <h2>History</h2>
            </div>
        </aside>
    )
}