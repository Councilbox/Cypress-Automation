import React from 'react';
import { PlaygroundContext } from './PlaygroundPage';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { js_beautify } from 'js-beautify';
import { BasicButton } from '../../displayComponents';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';

const Playground = () => {
    const playgroundContext = React.useContext(PlaygroundContext);

    console.log(playgroundContext)

    const updateVariables = value => {
        playgroundContext.setVariables(value);
    }

    return(
        <div
            style={{
                width: 'calc(100% - 250px)',
                height: '100%',
                backgroundColor: '#424242',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1em',
            }}
        >
            <div style={{width: '45%', height: 'calc(100% - 3em)'}}>
                <div style={{width: '100%', height: '60%'}}>
                    <CodeMirror
                        options={{
                            mode: 'javascript',
                            theme: 'darcula',
                            lineNumbers: true,
                            json: true
                        }}
                        value={playgroundContext.operation && playgroundContext.operation.query}
                    />
                </div>
                <div style={{width: '100%', height: '40%'}}>
                    <CodeMirror
                        options={{
                            mode: 'application/json',
                            theme: 'darcula',
                            lineNumbers: true,
                            readOnly: false
                        }}
                        onBeforeChange={(editor, data, value) => {
                            updateVariables(value)
                        }}
                        value={!!playgroundContext.operation && !!playgroundContext.operation.variables && js_beautify(playgroundContext.operation.variables)}
                    />
                </div>
            </div>
            <div style={{height: '100%', display: 'flex', alignItems: 'center'}}>
                <BasicButton
                    text="Enviar"
                    textStyle={{fontWeight: '700'}}
                    onClick={playgroundContext.sendOperation}
                />
            </div>
            <div style={{width: '45%', height: '100%'}}>
                <CodeMirror
                    options={{
                        mode: 'javascript',
                        lineNumbers: true,
                        theme: 'darcula',
                        json: true
                    }}
                    value={!!playgroundContext.operation && !!playgroundContext.operation.response && js_beautify(playgroundContext.operation.response)}
                />
            </div>
        </div>
    )
}

export default Playground;