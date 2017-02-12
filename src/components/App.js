import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
    constructor() {
        super();

        this.addFish = this.addFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);

        // getinitialState
        this.state = {
            fishes: {},
            order: {}
        };
    }

    componentWillMount(){
        // this runs before <App> is rendered
        // get store name (storeId)
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`
            , {
                context: this,
                state: 'fishes'
            });

        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
        if(localStorageRef){
            // update the App components order state
            this.setState({
                order: JSON.parse(localStorageRef)
            });
        }
    }
    componentWillUnmount(){
        base.removeBinding(this.ref);
    }
    componentWillUpdate(nextProps, nextState){
        localStorage.setItem(`order-${this.props.params.storeId}`,
        JSON.stringify(nextState.order));
    }

    // Add
    addFish(fish){
        // update the state
        const fishes = {...this.state.fishes};
        // add in new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        // set state
        this.setState({ fishes });
    }
    // Remove
    removeFish(key){
        const fishes = {...this.state.fishes};
        fishes[key] = null; // null deletes in Firebase
        this.setState({fishes});
    }

    // Update Fish
    updateFish(key, updatedFish){
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({fishes});
    }

    // Load sample fish
    loadSamples(){
        this.setState({
           fishes: sampleFishes
        });
    }

    // Add items to order
    addToOrder(key) {
        // take a copy of the state
        const order = {...this.state.order};
        // update OR add the new number of fish ordered
        order[key] = order[key] + 1 || 1;
        // update the state
        this.setState({order});
    }
    // Remove items from order
    removeFromOrder(key){
        const order = {...this.state.order};
        delete order[key];
        this.setState({order});
    }

    render() {
        return (
        	<div className="catch-of-the-day">
	        	<div className="menu">
	        		<Header tagline="Fresh Seafood" />
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                // Make each Fish component unique using key
                                .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />)
                        }
                    </ul>
	        	</div>
	        	<Order
                    fishes={this.state.fishes}
                    order={this.state.order}
                    params={this.props.params}
                    removeFromOrder={this.removeFromOrder} />
	        	<Inventory
                    addFish={this.addFish}
                    removeFish={this.removeFish}
                    loadSamples={this.loadSamples}
                    fishes={this.state.fishes}
                    updateFish={this.updateFish} />
    		</div>
    	)
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
};

export default App;
