package mk.ukim.finki.examscheduler.web.model.enumerations;

import lombok.Getter;

@Getter
public enum ExamType {
    LAB(RoomType.LAB),
    CLASSROOM(RoomType.CLASSROOM),
    ONLINE(RoomType.VIRTUAL),
    HOMEWORK(RoomType.VIRTUAL);

    private RoomType roomType;

    ExamType(RoomType roomType) {
        this.roomType = roomType;
    }
}
