export default function AdminButton({ text }) {
    return (
        <button className=" text-primary-orange border border-primary-orange font-bold rounded-full px-4 py-2 hover:bg-primary-orange hover:text-white transition duration-300">
            {text}
        </button>
    );
}
