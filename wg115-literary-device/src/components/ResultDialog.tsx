import React from "react";
import {
    Dialog,
    DialogContent,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";
import type { Root } from "./../../interface";

interface Props {
    open: boolean;
    onClose: () => void;
    device: Root;
    selectedAnswer: string;
    sentence: string;
}

const ResultDialog: React.FC<Props> = ({
    open,
    onClose,
    device,
    selectedAnswer,
    sentence
}) => {
    const result = device.player.correctAnswers.find(
        (ans) => ans.answer === selectedAnswer
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent>
                <Box mb={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">{sentence}</Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Card>
                    <CardContent>
                        <Typography>
                            {result?.explanation ||
                                result?.title ||
                                "Incorrect combination."}
                        </Typography>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
};

export default ResultDialog;