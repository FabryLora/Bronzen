export default function MassEmailTemplate({ info }) {
    return (
        <div
            style={{
                backgroundColor: "#f3f3f3",
                padding: "40px",
                textAlign: "center",
            }}
        >
            <table
                align="center"
                width="100%"
                style={{
                    maxWidth: "600px",
                    backgroundColor: "#ffffff",
                    borderRadius: "10px",
                    padding: "20px",
                    border: "1px solid #ddd",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                }}
            >
                <tr>
                    <td>
                        <h1
                            style={{
                                fontSize: "24px",
                                color: "#0077cc",
                                marginBottom: "20px",
                            }}
                        >
                            {info?.title}
                        </h1>

                        <p
                            style={{
                                fontSize: "18px",
                                color: "#0077cc",
                                fontWeight: "bold",
                                marginTop: "20px",
                            }}
                        >
                            Mensaje:
                        </p>
                        <p>
                            <div
                                dangerouslySetInnerHTML={{ __html: info?.text }}
                            />
                        </p>
                    </td>
                </tr>
            </table>
        </div>
    );
}
