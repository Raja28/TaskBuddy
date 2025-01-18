import './loader.css'

export const Loader: React.FC = () => {

    return (
        <div className="d-flex flex-column justify-content-center align-items-center border vh-100" >
            <span className="spinner"></span>
            <span>Loading...</span>
        </div>
    )
}