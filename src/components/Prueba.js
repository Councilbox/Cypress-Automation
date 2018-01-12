import React from 'react';


class Prueba extends React.Component {
    render(){
        return(
            <div>
                {this.props.text}
                <button onClick={this.props.changeText}>Button</button>
            </div>
        );
    }
}


export default Prueba;