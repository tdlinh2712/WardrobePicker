import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

const Header = () => <h2>Header</h2>;
const Dashboard = () => <h2>Dashboard</h2>;
const Landing = () => <h2>Langing</h2>;
const WardrobeNew = () => <h2>WardrobeNew</h2>;


const App = () => {
    return (
        <div>
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/wardrobes" component={Dashboard} />
                </div>
            </BrowserRouter>
        </div>
    );
};
export default App;