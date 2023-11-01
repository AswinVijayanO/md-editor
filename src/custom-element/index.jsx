import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco,stackoverflowLight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
export const Code = ({ code, lang }) => {
    return (
        <SyntaxHighlighter language={lang} style={stackoverflowLight} showLineNumbers customStyle={{fontFamily:'DM Mono'}} >
            {code}
        </SyntaxHighlighter>
    )
}