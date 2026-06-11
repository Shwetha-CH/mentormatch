package com.mentormatch.app.entity;

import jakarta.persistence.*;

@Entity
@Table(schema = "student")
public class user_student {
    public user_student() {
    }

    public user_student(User user, String headline, String intrests, String currentrole, int scnt) {
        this.user = user;
        this.headline = headline;
        this.intrests = intrests;
        this.currentrole = currentrole;
        this.scnt = scnt;
    }

    public long getSid() {
        return sid;
    }

    public void setSid(long sid) {
        this.sid = sid;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getIntrests() {
        return intrests;
    }

    public void setIntrests(String intrests) {
        this.intrests = intrests;
    }

    public String getCurrentrole() {
        return currentrole;
    }

    public void setCurrentrole(String currentrole) {
        this.currentrole = currentrole;
    }

    public int getScnt() {
        return scnt;
    }

    public void setScnt(int scnt) {
        this.scnt = scnt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long  sid;

//    @Column(name = "uid")
//    private long uid;

    @ManyToOne
    @JoinColumn(name = "uid", referencedColumnName = "id")
    private User user;


    @Column(name = "headline")
    private String headline;

    @Column(name = "intrests")
    private String intrests;

    @Column(name = "currentrole")
    private String currentrole;

    @Column(name = "scnt")
    private int scnt;
}
